// store.js
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default is localStorage
import authSlice from './authSlice';
import postSlice from './postSlice';
import notificationSlice from './notificationSlice';
import userSlice from './userSlice';
import chatSlice from './chatSlice';

// Persist configuration for the user slice
const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['userData', 'likedPosts', 'savedPosts', 'following', 'followers', 'postsCreated'], // Persist these properties
};

// Persist configuration for the notification slice
const notificationPersistConfig = {
  key: 'notifications',
  storage,
  whitelist: ['notifications'], // Assuming you have a 'notifications' array
};

// Persist configuration for the auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['userData', 'status'], //  persist the user data
};

// Persist configuration for the chat slice
const chatPersistConfig = {
    key: 'chat',
    storage,
    whitelist: ['chats', 'messages'], // persist chats
  };

// Persist configuration for the chat slice
const postsPersistConfig = {
  key: 'posts',
  storage,
  whitelist: ['posts'], // persist chats
};

// Persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);
const persistedUserReducer = persistReducer(userPersistConfig, userSlice);
const persistedNotificationReducer = persistReducer(notificationPersistConfig, notificationSlice);
const persistedChatReducer = persistReducer(chatPersistConfig, chatSlice);
const persistedPostReducer = persistReducer(postsPersistConfig, postSlice); 


const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    posts: persistedPostReducer, 
    notifications: persistedNotificationReducer,
    user: persistedUserReducer,
    chat: persistedChatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
