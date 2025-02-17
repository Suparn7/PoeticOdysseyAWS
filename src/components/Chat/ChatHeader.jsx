import React from "react";
import { Link } from "react-router-dom";

const ChatHeader = ({ receiverProfilePicUrl, receiverName, receiverId }) => (
  <div className="chat-header">
    <div className="header-profile-container">
      <div className="profile-pic-container">
        <img
          src={receiverProfilePicUrl || "https://via.placeholder.com/50"}
          alt={`${receiverName}'s profile`}
          className="profile-pic"
        />
      </div>
      <Link to={`/PoeticOdyssey/profile/${receiverId}`} className="profile-link">
        {receiverName}
      </Link>
    </div>
  </div>
);

export default ChatHeader;