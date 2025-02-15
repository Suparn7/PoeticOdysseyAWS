import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import realTimeChatService from "../../appwrite/RealTimeChatService";
import chatService from "../../appwrite/ChatService";
import { setMessages, addMessage, addReaction, removeReaction } from "../../store/chatSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faImage, faTimes, faPaperPlane, faSpinner, faThumbsUp, faSmile, faHeart, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import "./ChatWindow.css";
import conf from "../../conf/conf";
import awsChatService from "../../aws/awsChatService";
import useWebSocketService from "../../webSocketServices/useWebSocketService";


const ChatWindow = ({ chatId, userId, receiverId, receiverName, receiverProfilePicUrl, updateLatestMessage }) => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const messageListRef = useRef(null);
  const fileInputRef = useRef(null);

  const [showReactions, setShowReactions] = useState(null);
  const [selectedReactions, setSelectedReactions] = useState({});
  const [chatSocketUrl, setChatSocketUrl] = useState(null);


  const reactionsList = ["thumbsup", "heart", "laugh", "sad", "angry", "surprised", "like", "thumbsdown"];

  useEffect(() => {
    setIsLoading(true); // Set loading to true when fetching messages

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
      setIsLoading(false); // Set loading to false after data is fetched
    }
    
  }, [chatId, dispatch]);

  useEffect(() => {
    if (chatId) {
      setChatSocketUrl(`wss://dw0mhlo126.execute-api.ap-south-1.amazonaws.com/production/?chatId=${chatId}&userId=${userId}`);
    }
  }, [chatId, userId]);

  const { sendJsonMessage, lastJsonMessage } = useWebSocketService(chatSocketUrl);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      console.log('Received message:', lastJsonMessage);
  
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
  
      // Handle other actions if needed
    }
  }, [lastJsonMessage, dispatch]);
  

  useEffect(() => {
    // Ensure that messageListRef.current is available before trying to scroll
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, image, isLoading]);  // Trigger the scroll effect when messages or image change

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
      console.log("newMessage", newMessage);
      
      if(newMessage) sendJsonMessage({ action: 'sendMessage', data: newMessage });
      
      setMessage("");
      setImage(null);
      setImageFile(null);
      setIsUploading(false);
    }
  };

  const handleAddReaction = async (messageId, reactionType) => {
    if (selectedReactions[messageId] && selectedReactions[messageId][userId] === reactionType) {
      handleRemoveReaction(messageId); // Remove reaction if already selected
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
    setShowReactions(null); // Close reaction options
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
            [userId]: null, // Set reaction to null for this user
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

      {/* Show loader when loading */}
      {isLoading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="message-list" ref={messageListRef}>
          {messages.map((msg) => (
            <div
              key={msg.messageId}
              className={`message ${msg.senderId === userId ? "sent" : "received"}`}
            >
              <div className="message-header">
                <span className={`message-sender ${msg.senderId === userId ? "you" : "receiver"}`}>
                  {msg.senderId === userId ? "You" : receiverName}
                </span>
              </div>

              {msg.msgType === "text" ? (
                <p>{msg.messageContent}</p>
              ) : (
                <div className="image-preview-in-message-list">
                  <img src={msg.msgImg} alt="message" className="preview-image" />
                </div>
              )}

              {/* Reactions Display */}
              <div className="reaction-smiley" onClick={() => handleToggleReactions(msg.messageId)}>
                {selectedReactions[msg.messageId] && Object.keys(selectedReactions[msg.messageId]).length > 0 ? (
                  <span className="reaction-display">
                    {Object.keys(selectedReactions[msg.messageId]).map((reactingUserId) => {
                      const reactionType = selectedReactions[msg.messageId][reactingUserId];

                      return (
                        <span key={reactingUserId} className="reaction-item">
                          {/* Render the reaction type for each user */}
                          {reactionType === "thumbsup" && "👍"}
                          {reactionType === "heart" && "❤️"}
                          {reactionType === "laugh" && "😂"}
                          {reactionType === "sad" && "😢"}
                          {reactionType === "angry" && "😡"}
                          {reactionType === "surprised" && "😲"}
                          {reactionType === "like" && "👍"}
                          {reactionType === "thumbsdown" && "👎"}

                          {/* Profile picture of the reacter */}
                          <img
                            src={receiverProfilePicUrl} // Use receiver's profile pic URL here
                            alt="user profile"
                            className="reaction-profile-pic"
                          />
                        </span>

                      );
                    })}
                  </span>
                ) : (
                  msg.senderId !== userId && <FontAwesomeIcon icon={faSmile} />
                )}
              </div>

              {/* Reaction options */}
              {msg.senderId !== userId && showReactions === msg.messageId && (
                <div className="reaction-options">
                  {reactionsList.map((reaction) => (
                    <span
                      key={reaction}
                      onClick={() => handleAddReaction(msg.messageId, reaction)}
                      style={{
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
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
              )}
            </div>
          ))}
        </div>

      )}

      {image && (
        <div className="image-preview-in-message-list">
          <FontAwesomeIcon
            icon={faTimes}
            className="cancel-icon"
            onClick={handleCancelImage}
          />
          <img src={image} alt="preview" className="preview-image" />
        </div>
      )}

      <div className="chat-input">
        <div className="chat-input-icons">
          <label htmlFor="file-input">
            <FontAwesomeIcon icon={faPaperclip} className="icon" />
          </label>
          <input
            ref={fileInputRef}
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <FontAwesomeIcon icon={faImage} className="icon" />
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>
          {isUploading ? (
            <FontAwesomeIcon icon={faSpinner} spin size="lg" />
          ) : (
            <FontAwesomeIcon icon={faPaperPlane} size="lg" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
