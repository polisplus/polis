/** @jsx jsx */

import React, { useEffect } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Heading, Box, Grid, Flex, Text, Link, jsx } from "theme-ui"

const Index = ({ user }: { user? }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const grid = {
    borderTop: "1px solid",
    borderColor: "lighterGray",
    pt: "14px",
    pb: "4px",
    lineHeight: 1.35,
  }

  const samples = [
    "The proposal to upgrade sector storage seems ready for launch.",
    "We should consider using Matrix and Element for giving the community a place to discuss governance issues. Their values around decentralization line up well with ours, and lots of other platforms use them.",
    "I'm personally overwhelmed by the number of governance platforms that I have to keep up with. It would be easier to continue to use Github discussions.",
  ]

  return (
    <React.Fragment>
      <Flex sx={{ mb: [4, null, 5] }}>
        <Box sx={{ flex: 3 }}>
          <Box sx={{ flex: 1, maxWidth: ["none", "26em"], pr: [3] }}>
            <Box sx={{ mt: [6, 9], pb: [1] }}>
              <img
                src="/foundation.png"
                width="20"
                style={{ position: "relative", top: 2, opacity: 0.81 }}
              />
              <Text sx={{ display: "inline", ml: "9px", fontWeight: "700" }}>Fil Poll</Text>
            </Box>
            <Heading
              as="h1"
              sx={{
                fontSize: [6],
                lineHeight: 1.2,
                mt: [4],
                mb: [4],
                maxWidth: "26em",
                fontWeight: "700",
              }}
            >
              The collaborative consensus engine
            </Heading>
            <Text sx={{ my: 3 }}>
              Fil Poll is a tool for groups to identify shared opinions, beliefs, and ideas, using
              collaborative polling and advanced statistics.
            </Text>
            <Box sx={{ mt: 4 }}>
              <RouterLink
                sx={{
                  variant: "links.buttonBlack",
                  mr: [2],
                  lineHeight: 3,
                }}
                to="/dashboard"
              >
                Go to app
              </RouterLink>
              {!user?.email && !user?.githubUserId && !user?.xInfo && (
                <Link
                  sx={{ variant: "links.buttonBlack", lineHeight: 3 }}
                  href={`/api/v3/github_oauth_init?dest=${window.location.href}`}
                >
                  Sign in with Github
                </Link>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 3,
            display: ["none", "block"],
            mt: [7],
            pt: "10px",
            mr: [0, 0, 0, "-20px"],
            pl: [3],
          }}
        >
          {samples.map((sample, index) => (
            <Box
              key={index}
              sx={{
                background: "#faf7f2",
                color: "#1f1f1f",
                fontSize: "0.91em",
                lineHeight: 1.35,
                px: "30px",
                pt: "24px",
                pb: "24px",
                mb: "2px",
                boxShadow: "1px 2px 4px 0 rgba(0,0,0,0.20)",
                borderRadius: "2px",
              }}
            >
              {sample}

              <Flex sx={{ position: "relative", width: "200px", mt: [3] }}>
                <Box sx={{ height: "4px", width: "28%", bg: "#7fc782" }}></Box>
                <Box sx={{ height: "4px", width: "18%", bg: "#c75f4c" }}></Box>
                <Box sx={{ height: "4px", width: "33%", bg: "#c9c5bb" }}></Box>
              </Flex>
            </Box>
          ))}
        </Box>
      </Flex>
      <Box sx={{ maxWidth: "34em", margin: "0 auto", mt: [9] }}>
        <Heading as="h3" sx={{ pb: 4 }}>
          Ask any question
        </Heading>
        <Grid gap={2} columns={[2, "1fr 2fr"]} sx={{ fontSize: "0.94em" }}>
          <Box sx={grid}>Learn about members</Box>
          <Box sx={{ ...grid }}>“What makes you excited to be in this community?’’</Box>
          <Box sx={grid}>Collect feedback</Box>
          <Box sx={{ ...grid }}>“How could we improve our user interface?’’</Box>
          <Box sx={grid}>Set priorities</Box>
          <Box sx={{ ...grid }}>“Which initiatives should we focus on this year?’’</Box>
          <Box sx={{ borderBottom: "1px solid", ...grid, pb: "12px" }}>Delegation support</Box>
          <Box sx={{ borderBottom: "1px solid", ...grid, pb: "12px" }}>
            “As a delegate, who do you represent? What perspectives do you bring to the table, and
            what kinds of proposals would you like to support?’’
          </Box>
        </Grid>
      </Box>
      <Box sx={{ maxWidth: "34em", margin: "auto", mt: [9] }}>
        <Heading as="h3">How it works</Heading>
        <p>1. The survey creator asks a question, seeding it with 10-15 suggested responses.</p>
        <p>
          2. Participants vote on responses, contributing their own additions. The survey
          prioritizes which ones to show in realtime.
        </p>
        <p>
          3. We generate a report of top responses, key opinion groups, areas of consensus, and
          points of further exploration.
        </p>
      </Box>
      <Box sx={{ maxWidth: "34em", margin: "0 auto", mt: [9], mb: [8] }}>
        <Heading as="h3">Background</Heading>
        <p>
          Fil Poll is an extended version of{" "}
          <Link
            href="https://forum.effectivealtruism.org/posts/9jxBki5YbS7XTnyQy/polis-why-and-how-to-use-it"
            target="_blank"
            noreferrer="noreferrer"
            noopener="noopener"
          >
            Polis
          </Link>
          , an academically validated collective-response survey used with groups of 200,000+ by
          governments and independent media.
        </p>
        <p>
          Polis is typically used as a large-scale opinion poll. Fil Poll is for small communities
          that align around a shared mission.
        </p>
        <Box sx={{ mt: [5, 6], textAlign: "center" }}>
          <Link
            sx={{
              variant: "links.button",
              display: "inline-block",
              mb: [3],
              border: "none !important",
              minWidth: "220px",
            }}
            href="https://gwern.net/doc/sociology/2021-small.pdf"
            target="_blank"
            noreferrer="noreferrer"
            noopener="noopener"
          >
            Read the Polis paper
          </Link>
          <br />
          <Link
            sx={{
              variant: "links.button",
              display: "inline-block",
              border: "none !important",
              minWidth: "220px",
            }}
            href="https://compdemocracy.org/Case-studies/"
            target="_blank"
            noreferrer="noreferrer"
            noopener="noopener"
          >
            Polis case studies
          </Link>
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default Index
