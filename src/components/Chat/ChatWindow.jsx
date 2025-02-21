import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, addMessage, addReaction, removeReaction } from "../../store/chatSlice";
import useWebSocketService from "../../webSocketServices/useWebSocketService";
import awsChatService from "../../aws/awsChatService";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ImagePreview from "./ImagePreview";
import ChatInput from "./ChatInput";
import "./ChatWindow.css";

const ChatWindow = ({ chatId, userId, receiverId, receiverName, receiverProfilePicUrl, updateLatestMessage, sendJsonMessage, lastJsonMessage }) => {
  
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messageListRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showReactions, setShowReactions] = useState(null);
  const [selectedReactions, setSelectedReactions] = useState({});
  const reactionsList = ["thumbsup", "heart", "laugh", "sad", "angry", "surprised", "like", "thumbsdown"];

  useEffect(() => {
    setIsLoading(true);
    const fetchMessages = async () => {
      const fetchedMessages = await awsChatService.getMessagesByChat(chatId);
      const sortedMessages = [...fetchedMessages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      dispatch(setMessages(sortedMessages));
      const initialReactions = {};
      fetchedMessages.forEach((msg) => {
        if (msg.reactions) {
          msg.reactions.forEach((reaction) => {
            const [messageId, userId, reactionType] = reaction.split('+');
            if (!initialReactions[messageId]) initialReactions[messageId] = {};
            initialReactions[messageId][userId] = reactionType;
          });
        }
      });
      setSelectedReactions(initialReactions);
    };
    if (chatId) {
      fetchMessages();
      setIsLoading(false);
    }
  }, [chatId, dispatch]);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      if (lastJsonMessage.action === 'sendMessage') {
        dispatch(addMessage(lastJsonMessage.data));
        updateLatestMessage(chatId, lastJsonMessage.data);
      } else if (lastJsonMessage.action === 'addReaction') {
        const { messageId, reactions } = lastJsonMessage.data;
        setSelectedReactions((prevState) => ({
          ...prevState,
          [messageId]: reactions.reduce((acc, reaction) => {
            const [msgId, userId, reactionType] = reaction.split('+');
            acc[userId] = reactionType;
            return acc;
          }, {}),
        }));
        dispatch(addReaction({ messageId, reactions }));
      } else if (lastJsonMessage.action === 'removeReaction') {
        const { messageId, reactions } = lastJsonMessage.data;
        setSelectedReactions((prevState) => ({
          ...prevState,
          [messageId]: reactions.reduce((acc, reaction) => {
            const [msgId, userId, reactionType] = reaction.split('+');
            acc[userId] = reactionType;
            return acc;
          }, {}),
        }));
        dispatch(removeReaction({ messageId, reactions }));
      }
    }
  }, [lastJsonMessage, dispatch]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, image, isLoading]);

  const handleSendMessage = async () => {
    if (message.trim() || imageFile) {
      let newMessage = null;
      setIsUploading(true);
      if (imageFile) {
        const uploadedUrl = await awsChatService.uploadChatFile(imageFile);
        if (uploadedUrl) {
          newMessage = await awsChatService.sendMessage({
            chatId,
            senderId: userId,
            receiverId,
            messageContent: message,
            messageType: "image",
            imageURL: uploadedUrl,
          });
        }
      } else {
        newMessage = await awsChatService.sendMessage({
          chatId,
          senderId: userId,
          receiverId,
          messageContent: message,
          messageType: "text",
        });
      }
      dispatch(addMessage(newMessage));
      if(newMessage) sendJsonMessage({ action: 'sendMessage', data: newMessage });
      setMessage("");
      setImage(null);
      setImageFile(null);
      setIsUploading(false);
    }
  };

  const handleAddReaction = async (messageId, reactionType) => {
    if (selectedReactions[messageId] && selectedReactions[messageId][userId] === reactionType) {
      handleRemoveReaction(messageId);
    } else {
      setSelectedReactions((prevState) => ({
        ...prevState,
        [messageId]: {
          ...prevState[messageId],
          [userId]: reactionType,
        },
      }));
      const updatedReactions = await awsChatService.addReaction(messageId, userId, reactionType);
      if (updatedReactions) {
        dispatch(addReaction({ messageId, reactions: updatedReactions }));
        sendJsonMessage({ action: 'addReaction', data: { messageId, chatId, reactions: updatedReactions } });
      }
    }
    setShowReactions(null);
  };

  const handleRemoveReaction = async (messageId) => {
    const currentReactionType = selectedReactions[messageId]?.[userId];
    if (currentReactionType) {
      const updatedReactions = await awsChatService.removeReaction(messageId, userId, currentReactionType);
      if (updatedReactions) {
        setSelectedReactions((prevState) => ({
          ...prevState,
          [messageId]: {
            ...prevState[messageId],
            [userId]: null,
          },
        }));
        dispatch(removeReaction({ messageId, reactions: updatedReactions }));
        sendJsonMessage({ action: 'removeReaction', data: { messageId, chatId, reactions: updatedReactions } });
      }
    }
  };

  const handleToggleReactions = (messageId) => {
    setShowReactions((prevState) => (prevState === messageId ? null : messageId));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleCancelImage = () => {
    setImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="chat-window">
      <ChatHeader 
        receiverProfilePicUrl={receiverProfilePicUrl} 
        receiverName={receiverName} 
        receiverId={receiverId} 
        sendJsonMessage={sendJsonMessage}
        lastJsonMessage={lastJsonMessage}
        chatId={chatId}
      />
      {isLoading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <MessageList
          messages={messages}
          userId={userId}
          receiverName={receiverName}
          selectedReactions={selectedReactions}
          handleToggleReactions={handleToggleReactions}
          handleAddReaction={handleAddReaction}
          showReactions={showReactions}
          reactionsList={reactionsList}
          receiverProfilePicUrl={receiverProfilePicUrl}
          messageListRef={messageListRef} // Pass the ref to MessageList
        />
      )}
      {image && <ImagePreview image={image} handleCancelImage={handleCancelImage} />}
      <ChatInput
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        isUploading={isUploading}
        handleImageChange={handleImageChange}
        fileInputRef={fileInputRef}
      />
    </div>
  );
};

export default ChatWindow;