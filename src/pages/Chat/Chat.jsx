import React, { useState, useEffect } from "react";
import ChatWindow from "../../components/Chat/ChatWindow";
import Modal from "../../components/Chat/Modal";
import "./ChatPage.css";
import chatService from "../../appwrite/ChatService";
import userService from "../../appwrite/userService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import realTimeChatService from "../../appwrite/RealTimeChatService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import AwsChatService from "../../aws/awsChatService";
import awsChatService from "../../aws/awsChatService";
import dynamoUserInformationService from "../../aws/dynamoUserInformationService";
import useWebSocketService from "../../webSocketServices/useWebSocketService";

const ChatPage = () => {
  const user = useSelector((state) => state.auth.userData);
  const userInfo = useSelector((state) => state.user.userData);

  const [chatId, setChatId] = useState(null);
  const [userId, setUserId] = useState(userInfo.userId);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const [latestMessages, setLatestMessages] = useState({});
  const [chatDetailsSocketUrl, setChatDetailsSocketUrl] = useState(null);
  

  // Function to update the chat list with a new message
  const updateChatListWithNewMessage = (chatId, newMessage) => {
    setChatList((prevChatList) => {
      let chatExists = false;
      const updatedChatList = prevChatList.map((chat) => {
        if (chat.chatId === chatId) {
          chatExists = true;
          return { ...chat, latestMessage: newMessage };
        }
        return chat;
      });
  
      if (!chatExists) {
        const chatDocument = {
          chatId,
          participants: [newMessage.senderId, newMessage.receiverId],
          createdAt: newMessage.timestamp,
          latestMessage: newMessage
        };
        updatedChatList.push(chatDocument);
      }
  
      return updatedChatList;
    });
  };
  
  // Fetch data and set state
  const fetchData = async () => {
    try {
      const chats = await awsChatService.getChatsByUser(userId);
      const usersData = await dynamoUserInformationService.getUsers();
  
      if (chats.length > 0) {
        // Fetch latest messages for each chat and add it to the chat object
        const messagesPromises = chats.map(async (chat) => {
          const messages = await awsChatService.getMessagesByChat(chat.chatId);
          
          return messages.length > 0 ? messages[messages.length - 1] : null;
        });
  
        // Wait for all the promises to resolve
        const latestMessagesList = await Promise.all(messagesPromises);
  
        // Add the latest message to each chat object
        const updatedChats = chats.map((chat, index) => ({
          ...chat,
          latestMessage: latestMessagesList[index],  // Add the latest message here
        }));
  
        // Update the chat list with latest messages
        setChatList(updatedChats);
      }
  
      if (usersData.users.length > 0) {
        setUserList(usersData.users);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Failed to load chats. Please try again later.");
      setLoading(false);
    }
  };

   useEffect(() => {
      if (userId) {
        setChatDetailsSocketUrl(`wss://ha2upjdfda.execute-api.ap-south-1.amazonaws.com/production/?userId=${userId}`);
      }
    }, [userId]);
  
    const { sendJsonMessage, lastJsonMessage } = useWebSocketService(chatDetailsSocketUrl);


  // Fetch data initially and when the user ID changes
  useEffect(() => {
    fetchData(); // Initially fetch data when component mounts
  }, [userId]);

   useEffect(() => {
       if (lastJsonMessage !== null) {
         console.log('Received message:', lastJsonMessage);
         updateChatListWithNewMessage(lastJsonMessage.data.chatId, lastJsonMessage.data);
       }
     }, [lastJsonMessage]);
  

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/PoeticOdyssey');
  };

  const handleUserSelect = async (selectedUserId) => {
    try {
      //existing chat dekho with messages if exists then just setChatId to open the window
      //else create a new chat and setChatId
      const existingChat = await awsChatService.getChatBetweenUsers(userId, selectedUserId);
      const selectedUserInfo = await dynamoUserInformationService.getUserInfoByUserNameId(selectedUserId);
      
      if(existingChat){
        setChatId(existingChat.chatId);
      } else {
        const newChat = await awsChatService.createChat(userId, selectedUserId, selectedUserInfo.name);
        setChatId(newChat.chatId);
      }
    } catch (error) {
      setError("Failed to create or fetch chat.");
      console.error(error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = userList && userList.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) && user.userId !== userId
);


  const handleBackToList = () => {
    setChatId(null);
    setSearchQuery("")
    fetchData(); // Re-fetch data when returning to the list
  };

  return (
    <div className="chatBtnWrapper">
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {chatId ? (
          <div>
            <button className="back-btn" onClick={handleBackToList}>
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </button>
            {chatList.map((chat) => {
              if (chat.chatId === chatId) {
                const receiverId = chat.participants.find(id => id !== userId);
                const receiver = userList.find(userItem => userItem.userId === receiverId);
                const receiverName = receiver ? receiver.name : "Unknown";

                return <ChatWindow 
                key={chatId} 
                chatId={chatId} 
                userId={userId} 
                receiverId={receiverId} 
                receiverName={receiverName} 
                receiverProfilePicUrl = {receiver.profilePicUrl}
                updateLatestMessage={updateChatListWithNewMessage}
                 />;
              }
              
            })}
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="chat-loading-text-container">
              <p className="chat-loading-text">
                {['L', 'o', 'a', 'd', 'i', 'n', 'g', '...'].map((letter, index) => (
                  <span
                    key={index}
                    className="chat-loading-letter"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {letter}
                  </span>
                ))}
              </p>
            </div>
            
            ) : error ? (
              <p>{error}</p>
            ) : chatList.length === 0 || chatList.every((chat) => chat.latestMessage === null || chat.latestMessage === "" || chat.latestMessage === undefined) ? (
              <div className="search-section" style={{ "minWidth": "100%" }}>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="searchInput text-black"
                />
                <p>No chats available. Select a user to start a chat.</p>
                <ul className="user-list">
                  {filteredUsers && filteredUsers.slice(0, showMore ? filteredUsers.length : 5).map((user) => (
                    <li className="user-card break-words" key={user.userId} onClick={() => handleUserSelect(user.userId)}>
                      <img src={user.profilePicUrl} alt={user.name} className="profile-pic" />
                      <span>{user.name}</span>
                    </li>
                  ))}
                </ul>
                {!showMore && filteredUsers.length > 5 && (
                  <button onClick={() => setShowMore(true)}>Show More Users</button>
                )}
              </div>
            ) : (
              <div className="chatList-modal-content">
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

                <div className="search-section">
                  <p className="search-text">Search Users to Start Chatting</p>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="searchInput text-black"
                  />
                  <ul className="user-list">
                    {searchQuery &&
                      filteredUsers.slice(0, showMore ? filteredUsers.length : 5).map((user) => (
                        <li key={user.userId} className="user-card" onClick={() => handleUserSelect(user.userId)}>
                          <div className="profile-pic-container">
                            <img
                              src={user.profilePicUrl || "https://via.placeholder.com/50"}  // Fallback to placeholder if no profile picture
                              alt={user.name}
                              className="profile-pic"
                            />
                          </div>
                          <span className="user-name">{user.name}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ChatPage;
