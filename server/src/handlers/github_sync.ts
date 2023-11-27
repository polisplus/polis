import fs from "fs/promises";
import os from "os";
import path from "path";
import child_process from "child_process";

import { Endpoints } from "@octokit/types";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { generateAndRegisterZinvite } from "../auth/create-user";
import Config from "../config";
import {
  getGraphqlForInstallation,
  getOctoKitForInstallation,
} from "./api_wrappers";
import {
  FipFields,
  PrFields,
  getConversationByPrId,
  getOrCreateUserWithGithubUsername,
  insertConversationPrAndFip,
  updateConversationPr,
  updateConversationPrAndFip,
} from "./queries";

const getServerNameWithProtocol = Config.getServerNameWithProtocol;

type FIPFrontmatterData = {
  title?: string;
  author?: string;
  "discussions-to"?: string;
  status?: string;
  type?: string;
  category?: string;
  created?: string;
};

type PullRequest =
  Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"][0];

const DISCUSSION_REGEX = new RegExp(
  `https://github.com/${process.env.FIP_REPO_OWNER}/${process.env.FIP_REPO_NAME}/discussions/(\\d+)`,
);

function execAsync(command: string, options: child_process.ExecOptions) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    child_process.exec(command, options, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

function parseFrontmatter(source: string) {
  /**
   * this function takes a roughly-yaml frontmatter string and tries to
   * extract all of the fields
   * it is more permissive than just using a yaml parser because users often
   * give invalid yaml (e.g. missing quotes around strings) for the values
   */

  const lines = source.split("\n");

  const pairs: { key: string; value: string }[] = [];
  for (const line of lines) {
    const parts = line.split(":");

    if (parts.length == 1) {
      // this is probably a continuation of the previous line
      if (pairs.length == 0) {
        continue;
      }
      pairs[pairs.length - 1].value += "\n" + line;
    } else if (parts.length == 2) {
      // this is a new line
      const [k, v] = parts;
      pairs.push({ key: k, value: v });
    } else {
      // the value contains colons, so merge them
      const [k, ...valueParts] = parts;
      const v = valueParts.join(":");
      pairs.push({ key: k, value: v });
    }
  }

  // reduce into object
  const frontmatter: FIPFrontmatterData = {
    title: "",
    author: "",
    "discussions-to": "",
    status: "",
    type: "",
    category: "",
    created: "",
  };
  for (const { key, value } of pairs) {
    const cleanedKey = key.trim().toLowerCase();

    for (const expectedKey of Object.keys(frontmatter)) {
      if (cleanedKey.startsWith(expectedKey)) {
        // is there a way to tell the type system that `expectedKey` is one of the keys of `frontmatter`
        // we need something like `Object.keys` but for objects with known fields
        // @ts-ignore
        frontmatter[expectedKey] = value.trim();
      }
    }
  }

  return frontmatter;
}

async function getFipFilenames(repoDir: string) {
  const dirsToVisit = ["/FIPS", "/FRCs"];

  const fipFilenames: string[] = [];

  for (const dirName of dirsToVisit) {
    let dir;

    try {
      dir = await fs.readdir(path.join(repoDir, dirName));
    } catch (err) {
      return;
    }

    for (const file of dir) {
      fipFilenames.push(`${dirName}/${file.toString()}`);
    }
  }

  return fipFilenames;
}

async function getFipFromPR(
  repoDir: string,
  pull: PullRequest,
  existingFipFilenames: Set<string>,
  mainBranchName: string,
): Promise<FipFields> {
  const owner = pull.head.user?.login as string;
  const repo = pull.head.repo?.name as string;

  const remote = `pull-${pull.id}`;

  // add remote
  await execAsync(
    `git remote add ${remote} https://github.com/${owner}/${repo}`,
    { cwd: repoDir },
  );

  // fetch the branches from the remote
  await execAsync(`git fetch ${remote}`, { cwd: repoDir });

  // check out the branch locally

  await execAsync(`git switch -c ${remote}-branch ${remote}/${pull.head.ref}`, {
    cwd: repoDir,
  });

  try {
    await execAsync(`git merge ${mainBranchName} -m "nothing"`, {
      cwd: repoDir,
    });
  } catch (err) {
    // an error is thrown here if there was a merge conflict that could not be
    // automatically resolved - we should just ignore these PRs
    await execAsync(`git reset --merge`, { cwd: repoDir });
  }

  await execAsync(`git merge --quit`, { cwd: repoDir });

  // get all of the names of the FIPs in this branch
  const fipFilenames = await getFipFilenames(repoDir);
  if (fipFilenames === undefined) {
    throw Error("fipFilenames is undefined");
  }

  // get the names of the FIPs that are new
  const newFipFilenames = fipFilenames.filter(
    (filename) => !existingFipFilenames.has(filename),
  );

  if (newFipFilenames.length == 0) {
    // the pull request is not creating a new FIP, ignore this
    console.error(`no new fips for ${owner}/${repo}#${pull.number}`);
    throw Error("no new fips");
  }

  if (newFipFilenames.length > 1) {
    console.error(
      `more than one fip for ${owner}/${repo}#${pull.number}, using the first one`,
    );
  }

  const filename = newFipFilenames[0];

  // get the contents of the new FIP
  const content = await fs.readFile(path.join(repoDir, filename), "utf8");

  // try to extract fip number
  const fipNumberMatch = filename.match(/fip-([0-9]*)/);
  const fipNumber = fipNumberMatch ? parseInt(fipNumberMatch[1], 10) : 0;

  // try to extract frontmatter
  const contentParts = content.split("---");
  const frontmatterSource = contentParts[1];
  const description = contentParts[2];

  let frontmatterData;
  try {
    frontmatterData = parseFrontmatter(frontmatterSource);
  } catch (err) {
    console.error(err);
    frontmatterData = {};
  }

  return {
    description,
    fip_number: fipNumber,
    fip_title: frontmatterData.title,
    fip_author: frontmatterData.author,
    fip_discussions_to: frontmatterData["discussions-to"],
    fip_status: frontmatterData.status,
    fip_type: frontmatterData.type,
    fip_category: frontmatterData.category,
    fip_created: frontmatterData.created,
  };
}

function getWelcomeMessage(serverNameWithProtocol: string, zinvite: string) {
  const url = `${serverNameWithProtocol}/dashboard/c/${zinvite}`;

  return (
    `Thank you for contributing a proposal! A discussion ` +
    `on Metropolis has been automatically opened [here](${url}) where users can give feedback.`
  );
}

async function addDiscussionComment(
  message: string,
  target: { repoOwner: string; repoName: string; discussionNumber: number },
) {
  const graphqlWithAuth = await getGraphqlForInstallation();

  // @ts-ignore
  const {
    repository: {
      discussion: { id: discussionId },
    },
  } = await graphqlWithAuth(
    `query {
      repository(owner: "${target.repoOwner}", name: "${target.repoName}") {
        discussion(number: ${target.discussionNumber}) {
          id
        }
      }
    }`,
  );

  await graphqlWithAuth(
    `mutation {
      addDiscussionComment(input: {discussionId: "${discussionId}", body: "${message}"}) {
        clientMutationId
      }
    }`,
  );
}

export async function handle_POST_github_sync(req: Request, res: Response) {
  try {
    const installationOctokit = await getOctoKitForInstallation();

    if (!process.env.FIP_REPO_OWNER) {
      throw Error("FIP_REPO_OWNER not set");
    }

    if (!process.env.FIP_REPO_NAME) {
      throw Error("FIP_REPO_NAME not set");
    }

    // we want the main branch to take precedence over all of the others
    const mainBranchName = "master";

    // get existing fips on master
    const { data: pulls } = await installationOctokit.request(
      "GET /repos/{owner}/{repo}/pulls?state=all",
      {
        repo: process.env.FIP_REPO_NAME,
        owner: process.env.FIP_REPO_OWNER,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    const workingDir = path.join(os.tmpdir(), uuidv4());
    await fs.mkdir(workingDir);

    // clone the repo
    console.log(`Cloning into ${workingDir}...`);

    child_process.execSync(
      `git clone https://github.com/${process.env.FIP_REPO_OWNER}/${process.env.FIP_REPO_NAME}`,
      { cwd: workingDir },
    );

    const repoDir = path.join(workingDir, process.env.FIP_REPO_NAME);

    const existingFipFilenames = new Set(await getFipFilenames(repoDir));

    console.log(
      `Found ${existingFipFilenames.size} FIPs in master, ${pulls.length} open PRs`,
    );

    for (const pull of pulls) {
      const githubUsername = pull.user?.login as string;
      const { uid } = await getOrCreateUserWithGithubUsername(githubUsername);

      const prFields: PrFields = {
        owner: uid,
        is_active: pull.state == "open",
        is_archived: pull.state == "closed",
        github_repo_name: pull.head.repo?.name,
        github_repo_owner: pull.head.repo?.owner?.login,
        github_branch_name: pull.head.ref,
        github_pr_id: pull.number,
        github_pr_title: pull.title,
        github_pr_submitter: pull.user?.login,
      };

      // check if there is a conversation with this PR id already
      const existingConversation = await getConversationByPrId(pull.number);
      if (existingConversation) {
        if (!existingConversation.github_sync_enabled) {
          console.log(
            `github sync is disabled for PR ${pull.number}, skipping`,
          );
          continue;
        }

        console.log(
          `conversation with PR ${pull.number} already exists, updating`,
        );

        // update
        if (pull.state == "open") {
          console.log(
            `conversation with PR id ${pull.number} is open, updating`,
          );
          // get fip
          let fipFields;
          try {
            fipFields = await getFipFromPR(
              repoDir,
              pull,
              existingFipFilenames,
              mainBranchName,
            );
          } catch (err) {
            console.log(`could not get fip for PR ${pull.number}, skipping`);
            console.log(err);
            continue;
          }

          // update conversation
          await updateConversationPrAndFip({ ...prFields, ...fipFields });
        } else {
          console.log(
            `conversation with PR id ${pull.number} is closed, updating`,
          );
          // we don't care about getting the FIP since it's no longer being discussed
          // but we want to update the PR status to closed
          await updateConversationPr(prFields);
        }
      } else {
        if (pull.state == "open") {
          // we only care about inserting conversations that are open
          console.log(
            `conversation with new PR id ${pull.number} does not exist, inserting`,
          );
          console.log(`trigger some sort of welcome event here`);
          // this PR has just been opened, we should trigger something here, e.g. post a comment/notification

          let fipFields;
          try {
            fipFields = await getFipFromPR(
              repoDir,
              pull,
              existingFipFilenames,
              mainBranchName,
            );
          } catch (err) {
            console.log(`could not get fip for PR ${pull.number}, skipping`);
            console.log(err);
            continue;
          }

          // const insertedRows = await insertConversationPrAndFip({
          //   ...prFields,
          //   ...fipFields,
          // });
          // const zid = insertedRows[0].zid;
          // const zinvite = await generateAndRegisterZinvite(zid, false);
          // const welcomeMessage = getWelcomeMessage(
          //   getServerNameWithProtocol(req),
          //   zinvite,
          // );
          // post comment to PR
          // await installationOctokit.request(
          //   "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
          //   {
          //     owner: process.env.FIP_REPO_OWNER,
          //     repo: process.env.FIP_REPO_NAME,
          //     issue_number: pull.number,
          //     body: welcomeMessage,
          //   },
          // );

          // // this will only work if the discussions_to field contains a single link to a discussion
          // // so it's kind of brittle
          // if (fipFields.fip_discussions_to) {
          //   try {
          //     // post the welcome message to the discussion as well
          //     const match =
          //       fipFields.fip_discussions_to.match(DISCUSSION_REGEX);
          //     if (match !== null) {
          //       const discussionNumber = match[1];
          //       // post to the discussion
          //       await addDiscussionComment(welcomeMessage, {
          //         repoOwner: process.env.FIP_REPO_OWNER as string,
          //         repoName: process.env.FIP_REPO_NAME as string,
          //         discussionNumber: parseInt(discussionNumber),
          //       });
          //     }
          //   } catch (err) {
          //     console.log(
          //       `could not post welcome message to discussion for PR ${pull.number}`,
          //     );
          //   }
          // }
        }
      }
    }

    res.json({});
  } catch (err) {
    console.error(err);
    res.status(500).send((err as any).message);
  }
}
