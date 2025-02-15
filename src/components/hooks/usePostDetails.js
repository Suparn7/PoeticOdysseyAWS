import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dynamoService from '../../aws/dynamoService';
import dynamoUserInformationService from '../../aws/dynamoUserInformationService';
import { setCommentsForPost, setLikedByForPost } from '../../store/postSlice';

const usePostDetails = (post, userData, lastJsonMessage) => {
    const [loading, setLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);
    const [fade, setFade] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [comments, setComments] = useState([]);
    const [author, setAuthor] = useState([]);
    const [likedByUser, setLikedByUser] = useState(false);
    const [savedByUser, setSavedByUser] = useState(false);
    const [likedByUsers, setLikedByUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visibleUsers, setVisibleUsers] = useState(3);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthor = post && userData ? post.userId === userData.userId : false;

    useEffect(() => {
        const fetchPostDetails = async () => {
            setLoading(true);
            try {
                if (post) {
                    setLikedByUser(post.likedBy?.includes(userData?.userId));
                    setSavedByUser(post.savedBy?.includes(userData?.userId));
                    const commentsForThePost = await dynamoService.getCommentsByPostId(post.blogId);
                    const newComments = commentsForThePost.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    if (post.userId === userData.userId) {
                        dispatch(setCommentsForPost({ postId: post.blogId, comments: newComments }));
                    }

                    setComments(newComments);
                    const authorDetails = await dynamoUserInformationService.getUserInfoByUserNameId(post.userId);
                    setAuthor(authorDetails);

                    const likedByUserDetails = await Promise.all(
                        (post.likedBy || []).map(async (userId) => {
                            const user = await dynamoUserInformationService.getUserInfoByUserNameId(userId);
                            return user;
                        })
                    );
                    setLikedByUsers(likedByUserDetails);
                } else {
                    navigate("/PoeticOdyssey");
                }
            } catch (error) {
                console.error("Error fetching post or users:", error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                    setFade(true);
                }, 500);
            }
        };

        fetchPostDetails();
    }, [navigate]);

    useEffect(() => {
        if (lastJsonMessage !== null) {
            console.log('Received message:', lastJsonMessage);

            if (lastJsonMessage.action === 'onComment') {
                setComments((prevComments) => {
                    const newComments = [
                        ...prevComments,
                        lastJsonMessage.data
                    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    dispatch(setCommentsForPost({ postId: post.blogId, comments: newComments }));

                    return newComments;
                });
            }

            if (lastJsonMessage.action === 'onCommentDelete') {
                const commentId = lastJsonMessage.data;
                setComments((prevComments) => {
                    const newComments = prevComments
                        .filter((comment) => comment.commentId !== commentId)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    dispatch(setCommentsForPost({ postId: post.blogId, comments: newComments }));

                    return newComments;
                });
            }

            if (lastJsonMessage.action === 'onLikePost' || lastJsonMessage.action === 'onUnlikePost') {
                const { postId, likedBy } = lastJsonMessage.data;

                const handleLikeUpdate = async () => {
                    try {
                        const updatedLikedByUsers = await Promise.all(
                            likedBy.map(async (userId) => {
                                const user = await dynamoUserInformationService.getUserInfoByUserNameId(userId);
                                return user;
                            })
                        );
                        setLikedByUsers(updatedLikedByUsers);
                        if (post.userId === userData.userId) {
                            dispatch(setLikedByForPost({ postId: post.blogId, likedBy: likedBy }));
                        }
                    } catch (error) {
                        console.error("Error fetching updated liked users:", error);
                    }
                };

                handleLikeUpdate();
            }
        }
    }, [lastJsonMessage]);

    return {
        loading,
        imageLoading,
        setImageLoading,
        fade,
        showConfirm,
        setShowConfirm,
        comments,
        author,
        likedByUser,
        setLikedByUser,
        setLikedByUsers,
        savedByUser,
        setSavedByUser,
        likedByUsers,
        isModalOpen,
        setIsModalOpen,
        visibleUsers,
        setVisibleUsers,
        isAuthor
    };
};

export default usePostDetails;