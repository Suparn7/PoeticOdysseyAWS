import awsChatService from "../aws/awsChatService";
import dynamoUserInformationService from "../aws/dynamoUserInformationService";

export const closeModal = (setIsModalOpen) => {
  setIsModalOpen(false);
};

export const handleUserSelect = async (userId, selectedUserId, setChatId, setChatList) => {
  try {
    const existingChat = await awsChatService.getChatBetweenUsers(userId, selectedUserId);
    const selectedUserInfo = await dynamoUserInformationService.getUserInfoByUserNameId(selectedUserId);
    let newChat = null;

    if (existingChat) {
      setChatId(existingChat.chatId);
    } else {
      newChat = await awsChatService.createChat(userId, selectedUserId, selectedUserInfo.name);
      setChatId(newChat.chatId);
    }

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
    console.error(error);
  }
};

export const handleSearchChange = (event, setSearchQuery) => {
  setSearchQuery(event.target.value);
};

export const getFilteredUsers = (userList, searchQuery, userId) => {
  return userList && userList.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) && user.userId !== userId
  );
};

export const handleBackToList = (setChatId, setSearchQuery, fetchData) => {
  setChatId(null);
  setSearchQuery("");
  fetchData();
};

// Function to update the chat list with a new message
export const updateChatListWithNewMessage = (chatId, newMessage) => {
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
export const fetchData = async () => {
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