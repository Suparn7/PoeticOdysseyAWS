import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ChatWindow from './ChatWindow';

const ChatWindowWrapper = ({ chatList, chatId, userId, userList, handleBackToList, updateChatListWithNewMessage }) => {
  return (
    <div>
      <button className="back-btn" onClick={handleBackToList}>
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </button>
      {chatList.map((chat) => {
        if (chat.chatId === chatId) {
          const receiverId = chat.participants.find(id => id !== userId);
          const receiver = userList.find(userItem => userItem.userId === receiverId);
          const receiverName = receiver ? receiver.name : "Unknown";

          return (
            <ChatWindow
              key={chat.chatId}
              chatId={chatId}
              userId={userId}
              receiverId={receiverId}
              receiverName={receiverName}
              receiverProfilePicUrl={receiver.profilePicUrl}
              updateLatestMessage={updateChatListWithNewMessage}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default ChatWindowWrapper;