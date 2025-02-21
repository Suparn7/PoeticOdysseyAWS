import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ChatWindow from './ChatWindow';
import useWebSocketService from '../../webSocketServices/useWebSocketService';
import dynamoUserInformationService from '../../aws/dynamoUserInformationService';

const ChatWindowWrapper = ({ chatList, chatId, userId, userList, handleBackToList, updateChatListWithNewMessage}) => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("ChatWindowWrapper rendered count: ", renderCount.current); 
  const [chatSocketUrl, setChatSocketUrl] = useState(null);
  const { sendJsonMessage, lastJsonMessage } = useWebSocketService(chatSocketUrl);

  useEffect(() => {
      if (chatId) {
        setChatSocketUrl(`wss://dw0mhlo126.execute-api.ap-south-1.amazonaws.com/production/?chatId=${chatId}&userId=${userId}`);
      }
  }, [chatId, userId]);

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
              lastJsonMessage={lastJsonMessage}
              sendJsonMessage={sendJsonMessage}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default ChatWindowWrapper;