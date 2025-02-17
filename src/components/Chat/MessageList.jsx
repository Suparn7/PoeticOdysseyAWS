import React from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages, userId, receiverName, selectedReactions, handleToggleReactions, handleAddReaction, showReactions, reactionsList, receiverProfilePicUrl, messageListRef }) => (
  <div className="message-list" ref={messageListRef}>
    {messages.map((msg) => (
      <MessageItem
        key={msg.messageId}
        msg={msg}
        userId={userId}
        receiverName={receiverName}
        selectedReactions={selectedReactions}
        handleToggleReactions={handleToggleReactions}
        handleAddReaction={handleAddReaction}
        showReactions={showReactions}
        reactionsList={reactionsList}
        receiverProfilePicUrl= {receiverProfilePicUrl}
      />
    ))}
  </div>
);

export default MessageList;