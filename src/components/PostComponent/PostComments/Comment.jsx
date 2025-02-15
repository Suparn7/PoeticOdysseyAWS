import React, { useState } from 'react';
import Container from '../../container/Container';
import CommentHeader from './CommentHeader';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import dynamoService from '../../../aws/dynamoService';
import buttonClick from "../../../audio/buttonClick.mp3";

const Comment = ({ isAuthor, userData, sendJsonMessage, post, comments }) => {
    const [newComment, setNewComment] = useState('');
    const [flyingComment, setFlyingComment] = useState('');
    const [showMoreComments, setShowMoreComments] = useState(false);

    const commentAddedAudio = new Audio(buttonClick);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !userData) return;

        setFlyingComment(newComment);
        commentAddedAudio.currentTime = 0;
        commentAddedAudio.play();

        const textarea = document.getElementById("commentTextarea");
        const rect = textarea.getBoundingClientRect();
        const flyingCommentElement = document.querySelector('.flying-comment');
        if (flyingCommentElement) {
            flyingCommentElement.style.top = `${rect.top + window.scrollY}px`;
            flyingCommentElement.style.left = `${rect.left + window.scrollX + textarea.offsetWidth / 2}px`;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const addedComment = await dynamoService.addComment(post.blogId, userData.userId, userData.name, newComment);
        if (addedComment) {
            sendJsonMessage({ action: 'onComment', data: addedComment });
            setNewComment('');
            console.log("Comment added successfully.");
        }

        setNewComment('');
        setFlyingComment('');
    };

    const getCommentDate = (date) => {
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "Yesterday";
        return date.toLocaleDateString();
    };

    const deleteComment = async (comment) => {
        try {
            await dynamoService.deleteComment(comment.commentId, post.blogId);
            const dataToDelete = {
                postId: post.blogId,
                commentId: comment.commentId
            };
            sendJsonMessage({ action: 'onCommentDelete', data: dataToDelete });
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment.");
        }
    };

    return (
        <Container className='mt-8 max-w-3xl'>
            <CommentHeader />
            <CommentForm 
                newComment={newComment} 
                setNewComment={setNewComment} 
                handleCommentSubmit={handleCommentSubmit} 
            />
            <div className="my-4 border-b border-gray-600"></div>
            <CommentList 
                comments={comments} 
                showMoreComments={showMoreComments} 
                setShowMoreComments={setShowMoreComments} 
                isAuthor={isAuthor} 
                userData={userData} 
                deleteComment={deleteComment} 
                getCommentDate={getCommentDate} 
                flyingComment={flyingComment} 
            />
        </Container>
    );
};

export default Comment;