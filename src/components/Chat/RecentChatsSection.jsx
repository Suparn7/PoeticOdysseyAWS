import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

const RecentChatsSection = ({ chatList, userId, userList, setChatId }) => {
  return (
    <div className="chat-section">
      <p>Recent Chats</p>
      <ul className="chat-list">
        {chatList.map((chat) => {
          const latestMessage = chat.latestMessage;
          const latestMessageContent = latestMessage ? latestMessage.messageContent : "No messages yet";
          const latestMessageImg = latestMessage ? latestMessage.msgImg : null;

          // Find the receiver (the one who is not the current user)
          const receiverId = chat.participants.find(id => id !== userId);
          
          // Find the receiver's name and profile picture from the userList
          const receiver = userList.find(userItem => userItem.userId === receiverId);
          const receiverName = receiver ? receiver.name : "Unknown";
          const receiverProfilePicUrl = receiver ? receiver.profilePicUrl : null;

          return (
            latestMessageContent !== "No messages yet" && (
              <li key={chat.chatId} className="chat-card" onClick={() => setChatId(chat.chatId)}>
                <div className="chat-card-content">
                  <div className="profile-pic-container">
                    <img
                      src={receiverProfilePicUrl || "https://via.placeholder.com/50"}  // Fallback to placeholder if no profile picture
                      alt={`${receiverName}'s profile`}
                      className="profile-pic"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="chat-name">{receiverName}</span>
                    <span className="recent-message">
                      {latestMessageImg && !latestMessageContent ? (
                        <FontAwesomeIcon icon={faImage} />
                      ) : (
                        `${latestMessageContent.length > 10 ? latestMessageContent.substring(0, 10) + "..." : latestMessageContent}`
                      )}
                    </span>
                  </div>
                </div>
              </li>
            )
          );
        })}
      </ul>
    </div>
  );
};

export default RecentChatsSection;