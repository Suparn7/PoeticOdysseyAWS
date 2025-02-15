// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userData: null,  // Store user data like name, email, likedPosts, etc.
    likedPosts: [],
    savedPosts: [],
    postsCreated: [],
    following: [],
    followers: [],
    createdAt: null,
    updatedAt: null,
    isVerified: false,
    isAdmin: false,
    status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData(state, action) {
            if (action.payload) {
                // Merge new data with existing user data
                state.userData = {
                    ...state.userData, // Keep existing userData
                    ...action.payload,  // Merge in new data
                };
        
                // Ensure to set defaults for any fields that may not be included in the payload
                state.likedPosts = [
                    ...new Set([
                        ...state.userData.likedPosts || [], // Existing likedPosts
                        ...(Array.isArray(action.payload.likedPosts) && action.payload.likedPosts ? action.payload.likedPosts : action.payload.likedPosts ? [action.payload.likedPosts] : []) // New liked posts
                    ])
                ];
        
                state.savedPosts = [
                    ...new Set([
                        ...state.userData.savedPosts || [], // Existing savedPosts
                        ...(Array.isArray(action.payload.savedPosts) && action.payload.savedPosts ? action.payload.savedPosts : action.payload.savedPosts ? [action.payload.savedPosts] : []) // New saved posts
                    ])
                ];
        
                state.postsCreated = [
                    ...new Set([
                        ...state.userData.postsCreated || [], // Existing postsCreated
                        ...(Array.isArray(action.payload.postsCreated) && action.payload.postsCreated ? action.payload.postsCreated : action.payload.postsCreated ? [action.payload.postsCreated] : []) // New posts created
                    ])
                ];

                state.following = [
                    ...new Set([
                        ...state.userData.following || [], // Existing following
                        ...(Array.isArray(action.payload.following) && action.payload.following ? action.payload.following : action.payload.following ? [action.payload.following] : []) // New followings
                    ])
                ];

                state.followers = [
                    ...new Set([
                        ...state.userData.followers || [], // Existing followers
                        ...(Array.isArray(action.payload.followers) && action.payload.followers ? action.payload.followers : action.payload.followers ? [action.payload.followers] : []) // New followers
                    ])
                ];
        
                // Set other fields, ensuring they have defaults
                state.createdAt = state.userData.createdAt || null;
                state.updatedAt = state.userData.updatedAt || null;
                state.isVerified = state.userData.isVerified || false;
                state.isAdmin = state.userData.isAdmin || false;
            }
        },
        
        clearUserData(state) {
            // Optional: Add a clear user data action to reset state
            state.userData = null;
            state.likedPosts = [];
            state.savedPosts = [];
            state.postsCreated = []
            state.following = []
            state.followers = []
            state.createdAt = null;
            state.updatedAt = null;
            state.isVerified = false;
            state.isAdmin = false;
            state.error = null;
            state.status = 'idle';
        },
        updateUserData(state, action) {
            const { field, value } = action.payload;
            if (state.userData) {
                state.userData[field] = value;
            }
        },
    }
});

export const { setUserData, clearUserData, updateUserData } = userSlice.actions;

export default userSlice.reducer;
