import React from "react";

const ReactionOptions = ({ messageId, handleAddReaction, reactionsList }) => (
  <div className="reaction-options">
    {reactionsList.map((reaction) => (
      <span
        key={reaction}
        onClick={() => handleAddReaction(messageId, reaction)}
        style={{ cursor: "pointer", fontSize: "18px" }}
      >
        {reaction === "thumbsup" && "👍"}
        {reaction === "heart" && "❤️"}
        {reaction === "laugh" && "😂"}
        {reaction === "sad" && "😢"}
        {reaction === "angry" && "😡"}
        {reaction === "surprised" && "😲"}
        {reaction === "like" && "👍"}
        {reaction === "thumbsdown" && "👎"}
      </span>
    ))}
  </div>
);

export default ReactionOptions;