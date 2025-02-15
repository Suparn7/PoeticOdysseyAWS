import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [],
};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        addPost: (state, action) => {
            state.posts.push({ ...action.payload, comments: [] }); // Add new post with an empty comments array
        },
        setLikedBy: (state, action) => {
            
        },
        deletePost: (state, action) => {
            const postIdToDelete = action.payload;
            state.posts = state.posts.filter(post => post.blogId !== postIdToDelete);
        },
        updatePost: (state, action) => {
            const { postId, updatedData } = action.payload;
            const index = state.posts.findIndex(post => post.blogId === postId);
            if (index !== -1) {
                state.posts[index] = { ...state.posts[index], ...updatedData };
            }
        },
        addCommentToPost: (state, action) => {
            const { postId, comment } = action.payload;
            const post = state.posts.find(post => post.blogId === postId);
            if (post) {
                post.comments.push(comment); // Add the new comment to the comments array
            }
        },
        setCommentsForPost: (state, action) => {
            const { postId, comments } = action.payload;
            const post = state.posts.find(post => post.blogId === postId);
            if (post) {
                post.comments = comments; // Set the comments for the specified post
            }
        },
        setLikedByForPost: (state, action) => {
            const { postId, likedBy } = action.payload;
            const post = state.posts.find(post => post.blogId === postId);
            if (post) {
                post.likedBy = likedBy;
            }
        },
        clearPosts: (state) => {
            state.posts = [];
        }
    },
});

export const { 
    setPosts, 
    addPost, 
    likePost, 
    savePost, 
    deletePost, 
    updatePost,
    addCommentToPost,
    setCommentsForPost,
    clearPosts,
    setLikedByForPost
} = postSlice.actions;

export default postSlice.reducer;
