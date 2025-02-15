import awsS3Service from '../aws/awsS3Service';
import dynamoService from '../aws/dynamoService';
import dynamoUserInformationService from '../aws/dynamoUserInformationService';
import { setUserData } from '../store/userSlice';
import { deletePost as deletePostAction } from '../store/postSlice'; 

export const deletePost = async (post, userData, dispatch, navigate) => {
    await dynamoService.deletePost(post.blogId)
        .then(async () => {
            if (post && post.featuredImage) {
                const key = post.featuredImage.split('.com/')[1]; // Extract the S3 key
                await awsS3Service.deleteFileFromS3({
                    bucketName: "poetic-odyssey-images", // S3 bucket name
                    fileName: key // Use the extracted key
                });
            }
            // Dispatch the action to remove the post from the Redux store
            dispatch(deletePostAction(post.blogId));
            await dynamoUserInformationService.removePostCreated(post.userId, post.blogId);

            // Update user's created posts in user data
            const updatedPostsCreated = userData.postsCreated.filter(id => id !== post.blogId);
            dispatch(setUserData({ postsCreated: updatedPostsCreated }));

            navigate("/PoeticOdyssey");
        });
};

export const handleLike = async (post, userData, likedByUser, setLikedByUser, setLikedByUsers, sendJsonMessage, dispatch, likeSound) => {
    if (!userData) return;
    try {
        const action = likedByUser ? "unlikePost" : "likePost";
        await dynamoUserInformationService[action](userData.userId, post.blogId);

        setLikedByUser(!likedByUser);

        // Play like sound effect
        likeSound.currentTime = 0; // Reset sound to start
        likeSound.play();

        let updatedLikedBy;
        if (likedByUser) {
            // Remove user from likedBy array
            updatedLikedBy = post.likedBy.filter(userId => userId !== userData.userId);
        } else {
            // Add user to likedBy array
            updatedLikedBy = [...new Set([...post.likedBy, userData.userId])];
        }

        await dynamoService.updatePost(post.blogId, { likedBy: updatedLikedBy });

        // Send WebSocket message with the updated likedBy array
        sendJsonMessage({
            action: likedByUser ? 'onUnlikePost' : 'onLikePost',
            data: {
                postId: post.blogId,
                likedBy: updatedLikedBy,
                userId: userData.userId // Include the userId
            }
        });
        const postsLiked = likedByUser
            ? userData.likedPosts.filter(postId => postId !== post.blogId) // Remove post from likedPosts
            : [...new Set([...(userData.likedPosts || []), post.blogId])]; // Add post to likedPosts

        dispatch(setUserData({ likedPosts: postsLiked }));

        const updatedLikedByUsers = await Promise.all(
            updatedLikedBy.map(async (userId) => {
                const user = await dynamoUserInformationService.getUserInfoByUserNameId(userId);
                return user;
            })
        );
        setLikedByUsers(updatedLikedByUsers);
    } catch (error) {
        console.error("Error liking/unliking post:", error);
    }
};

export const handleSave = async (post, userData, savedByUser, setSavedByUser, setLikedByUsers, sendJsonMessage, dispatch, saveSound) => {
    if (!userData) return;
    try {
        const action = savedByUser ? "unsavePost" : "savePost";
        await dynamoUserInformationService[action](userData.userId, post.blogId);

        setSavedByUser(!savedByUser);

        // Play save sound effect
        saveSound.currentTime = 0; // Reset sound to start
        saveSound.play();

        let updatedSavedBy;
        if (savedByUser) {
            // Remove user from savedBy array
            updatedSavedBy = post.savedBy.filter(userId => userId !== userData.userId);
        } else {
            // Add user to savedBy array
            updatedSavedBy = [...new Set([...post.savedBy, userData.userId])];
        }

        await dynamoService.updatePost(post.blogId, { savedBy: updatedSavedBy });

        const postsSaved = savedByUser
            ? userData.savedPosts.filter(postId => postId !== post.blogId) // Remove post from savedPosts
            : [...new Set([...(userData.savedPosts || []), post.blogId])]; // Add post to savedPosts

        dispatch(setUserData({ savedPosts: postsSaved }));
    } catch (error) {
        console.error("Error saving post:", error);
    }
};