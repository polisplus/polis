import React from "react"
import { Box } from "theme-ui"
import useSWR from "swr"

import ConversationListItem from "./conversation_list_item"
import { ConversationSummary } from "../../reducers/conversations_summary"

const ConversationsList = ({ selectedView }: {selectedView: "all" | "fips" | "polls"}) => {
  const { data } = useSWR(
    `conversations_summary`,
    async () => {
      const response = await fetch(`/api/v3/conversations_summary`)
      return (await response.json()) as ConversationSummary[]
    },
    { keepPreviousData: true, focusThrottleInterval: 500 },
  )

  const conversations = data || []

  let filteredConversations: ConversationSummary[] = []
  if(selectedView === "all") {
    filteredConversations = conversations
  } else if (selectedView === "fips") {
    filteredConversations = conversations.filter((conversation) => conversation.fip_version)
  } else if (selectedView === "polls") {
    filteredConversations = conversations.filter((conversation) => conversation.fip_version === null)
  }

  const conversationsToDisplay = filteredConversations.slice(0, 5)

  return (
    <React.Fragment>
      <Box sx={{ height: "calc(100vh - 150px)", overflow: "scroll", pb: "100px" }}>
        {conversationsToDisplay.map((conversation) => (
          <ConversationListItem
            conversation={conversation}
            key={conversation.conversation_id}
            initialViewCount={conversation.view_count}
          />
        ))}
      </Box>
    </React.Fragment>
  )
}

export default ConversationsList
