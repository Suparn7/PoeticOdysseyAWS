import React, { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import Modal from "./Modal";
import "./styles/ChatComponent.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import awsChatService from "../../aws/awsChatService";
import dynamoUserInformationService from "../../aws/dynamoUserInformationService";
import ChatWindowWrapper from "./ChatWindowWrapper";
import LoadingText from "./LoadingText";
import RecentChatsSection from "./RecentChatsSection";
import UserSearchSection from "./UserSearchSection";
import UserSearchAndSelect from "./UserSearchAndSelect";

//TODO: implement functions inside action.js
import { closeModal, handleUserSelect, handleSearchChange, getFilteredUsers, handleBackToList, fetchData, updateChatListWithNewMessage } from "../../actions/chatActions";

const ChatComponent = ({sendJsonMessage, lastJsonMessage, readyState}) => {
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
      // Check if an existing chat exists between the users
      const existingChat = await awsChatService.getChatBetweenUsers(userId, selectedUserId);
      const selectedUserInfo = await dynamoUserInformationService.getUserInfoByUserNameId(selectedUserId);
      let newChat = null;
  
      if (existingChat) {
        setChatId(existingChat.chatId);
      } else {
        // Create a new chat if no existing chat is found
        newChat = await awsChatService.createChat(userId, selectedUserId, selectedUserInfo.name);
        setChatId(newChat.chatId);
      }
  
      // Update the chat list with the selected user's chat
      setChatList((prevChatList) => {
        const chatExists = prevChatList.some(chat => chat.chatId === (existingChat ? existingChat.chatId : newChat.chatId));
        if (!chatExists) {
          const newChatEntry = {
            chatId: existingChat ? existingChat.chatId : newChat.chatId,
            participants: [userId, selectedUserId],
            createdAt: existingChat ? existingChat.createdAt : newChat.createdAt,
            latestMessage: null
          };
          return [...prevChatList, newChatEntry];
        }
        return prevChatList;
      });
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
          <ChatWindowWrapper
            chatList={chatList}
            chatId={chatId}
            userId={userId}
            userList={userList}
            handleBackToList={handleBackToList}
            updateChatListWithNewMessage={updateChatListWithNewMessage}
          />
        ) : (
          <div>
            {loading ? (
              <LoadingText />
            ) : error ? (
              <p>{error}</p>
            ) : chatList.length === 0 || chatList.every((chat) => chat.latestMessage === null || chat.latestMessage === "" || chat.latestMessage === undefined) ? (
              <UserSearchSection
                searchQuery={searchQuery}
                handleSearchChange={handleSearchChange}
                filteredUsers={filteredUsers}
                showMore={showMore}
                setShowMore={setShowMore}
                handleUserSelect={handleUserSelect}
              />
            ) : (
              <div className="chatList-modal-content">
                <RecentChatsSection
                  chatList={chatList}
                  userId={userId}
                  userList={userList}
                  setChatId={setChatId}
                />

                <UserSearchAndSelect
                  searchQuery={searchQuery}
                  handleSearchChange={handleSearchChange}
                  filteredUsers={filteredUsers}
                  showMore={showMore}
                  setShowMore={setShowMore}
                  handleUserSelect={handleUserSelect}
                />
              </div>

            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ChatComponent;
