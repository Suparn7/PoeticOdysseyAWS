import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import liked from "../../audio/liked.mp3";
import saved from "../../audio/saved.mp3";
import Container from '../container/Container';
import ShareButtons from '../../components/ShareButtons';
import Comment from './PostComments/Comment';
import '../../styles/loader.css';
import ButtonContainer from './LikeSaveButtons/ButtonContainer';
import AuthorDisplay from './PostDetails/AuthorDisplay';
import PostImage from './PostDetails/PostImage';
import PostTitle from './PostDetails/PostTitle';
import PostContent from './PostDetails/PostContent';
import LikedBySection from './LikedByDetails/LikedBySection';
import LikedByModal from './LikedByDetails/LikedByModal';
import ActionButtons from './ActionButtons/ActionButtons';
import { handleLike, handleSave } from '../../actions/postActions';
import usePostDetails from '../hooks/usePostDetails';
import DeletePostConfirmModal from './ConfirmModals/DeletePostConfirmModal';
import './styles/post.css';

const PostComponent = ({ post, userData, sendJsonMessage, lastJsonMessage, readyState }) => {
    const {
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
    } = usePostDetails(post, userData, lastJsonMessage);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleShowModal = () => {
        setIsModalOpen(true);
    };

    const handleShowMore = () => {
        setVisibleUsers(prevVisible => prevVisible + 3);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setVisibleUsers(3);
    };

    const confirmDelete = () => {
        setShowConfirm(true);
    };

    const likeSound = new Audio(liked);
    const saveSound = new Audio(saved);

    if (loading) {
        return (
            <Container>
                <div className="loader-overlay">
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                </div>
            </Container>
        );
    }

    return post && userData ? (
        <div className="glowing-border-wrapper">
            <div className={`py-8 flex flex-col items-center justify-center ${fade ? 'fade-in' : 'fade-out'}`} style={{ color: '#fff' }}>
                {isAuthor && (
                    <ActionButtons postId={post.blogId} confirmDelete={confirmDelete} />
                )}

                <Container className="relative z-10">
                    <div
                        className={`bg-white bg-opacity-10 backdrop-blur-lg mt-3 border border-white rounded-lg shadow-lg p-4 max-w-3xl w-full mx-auto transition-transform duration-500 ${
                            fade ? 'animate-fadeIn' : ''
                        }`}
                    >
                        <AuthorDisplay author={author} />
                        <ShareButtons post={post} />
                        <PostImage post={post} imageLoading={imageLoading} setImageLoading={setImageLoading} />
                        <PostTitle title={post.title} />
                        <PostContent post={post} author={author} userData={userData} />
                        <LikedBySection likedByUsers={likedByUsers} userData={userData} handleShowModal={handleShowModal} />
                        <LikedByModal
                            isModalOpen={isModalOpen}
                            handleCloseModal={handleCloseModal}
                            likedByUsers={likedByUsers}
                            userData={userData}
                            visibleUsers={visibleUsers}
                            handleShowMore={handleShowMore}
                        />
                    </div>
                </Container>

                <ButtonContainer
                    likedByUser={likedByUser}
                    handleLike={() => handleLike(post, userData, likedByUser, setLikedByUser, setLikedByUsers, sendJsonMessage, dispatch, likeSound)}
                    savedByUser={savedByUser}
                    handleSave={() => handleSave(post, userData, savedByUser, setSavedByUser, setLikedByUsers, sendJsonMessage, dispatch, saveSound)}
                />

                <Comment
                    isAuthor={isAuthor}
                    userData={userData}
                    sendJsonMessage={sendJsonMessage}
                    post={post}
                    comments={comments}
                />

                {showConfirm && (
                    <DeletePostConfirmModal
                        post={post}
                        dispatch={dispatch}
                        navigate={navigate}
                        setShowConfirm={setShowConfirm}
                        userData={userData}
                    />
                )}
            </div>
        </div>
    ) : null;
};

export default PostComponent;