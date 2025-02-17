import React, { useState, useEffect } from "react";
import "./ChatPage.css";
import { useSelector } from "react-redux";
import useWebSocketService from "../../webSocketServices/useWebSocketService";
import ChatComponent from "../../components/Chat/ChatComponent";

const ChatPage = () => {
  const userInfo = useSelector((state) => state.user.userData);
  const [chatDetailsSocketUrl, setChatDetailsSocketUrl] = useState('');
  

  useEffect(() => {
    if (userInfo.userId) {
      setChatDetailsSocketUrl(`wss://ha2upjdfda.execute-api.ap-south-1.amazonaws.com/production/?userId=${userInfo.userId}`);
    }
  }, [userInfo.userId]);
  
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocketService(chatDetailsSocketUrl);

  return (
    <ChatComponent sendJsonMessage={sendJsonMessage} lastJsonMessage={lastJsonMessage} readyState={readyState} />
  );
};

export default ChatPage;
