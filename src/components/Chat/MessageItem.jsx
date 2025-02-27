import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import ReactionOptions from "./ReactionOptions";
import './styles/messageItem.css'
import MissedCallMessage from "./MissedCallMessage";

const MessageItem = ({ msg, userId, receiverName, selectedReactions, handleToggleReactions, handleAddReaction, showReactions, reactionsList, receiverProfilePicUrl }) => (
  <div className={`message ${msg.senderId === userId ? "sent" : "received"}`}>
    <div className="message-header">
      <span className={`message-sender ${msg.senderId === userId ? "you" : "receiver"}`}>
        {msg.senderId === userId ? "You" : receiverName}
      </span>
    </div>

    {msg.msgType === "text" ? (
      <p>{msg.messageContent}</p>
    ) : msg.msgType === "missedCall" ? (
      <MissedCallMessage
          messageContent={msg.messageContent}
          isVideoCall={msg.messageContent.includes('video')}
        />
    ) : (
      <div className="image-preview-in-message-list">
        <img src={msg.msgImg} alt="message" className="preview-image" />
      </div>
    )}

    <div className="reaction-smiley" onClick={() => handleToggleReactions(msg.messageId)}>
      {selectedReactions[msg.messageId] && Object.keys(selectedReactions[msg.messageId]).length > 0 ? (
        <span className="reaction-display">
          {Object.keys(selectedReactions[msg.messageId]).map((reactingUserId) => {
            const reactionType = selectedReactions[msg.messageId][reactingUserId];
            return (
              <span key={reactingUserId} className="reaction-item">
                {reactionType === "thumbsup" && "👍"}
                {reactionType === "heart" && "❤️"}
                {reactionType === "laugh" && "😂"}
                {reactionType === "sad" && "😢"}
                {reactionType === "angry" && "😡"}
                {reactionType === "surprised" && "😲"}
                {reactionType === "like" && "👍"}
                {reactionType === "thumbsdown" && "👎"}
                <img src={receiverProfilePicUrl} alt="user profile" className="reaction-profile-pic" />
              </span>
            );
          })}
        </span>
      ) : (
        msg.senderId !== userId && <FontAwesomeIcon icon={faSmile} />
      )}
    </div>

    {msg.senderId !== userId && showReactions === msg.messageId && (
      <ReactionOptions
        messageId={msg.messageId}
        handleAddReaction={handleAddReaction}
        reactionsList={reactionsList}
      />
    )}
  </div>
);

export default MessageItem;