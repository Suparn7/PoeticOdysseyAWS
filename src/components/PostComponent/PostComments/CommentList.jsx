import React from 'react';
import Button from '../../Button';
import CommentItem from './CommentItem';

const CommentList = ({ comments, showMoreComments, setShowMoreComments, isAuthor, userData, deleteComment, getCommentDate, flyingComment }) => {
    return (
        <div className="comments-container mt-4 space-y-4 relative">
            {flyingComment && (
                <div className="flying-comment">
                    {flyingComment}
                </div>
            )}
            {comments.length === 0 ? (
                <div className="text-teal-50 text-center">No comments yet.</div>
            ) : (
                comments.slice(0, showMoreComments ? comments.length : 3).map((comment, index) => (
                    <CommentItem 
                        key={index} 
                        comment={comment} 
                        isAuthor={isAuthor} 
                        userData={userData} 
                        deleteComment={deleteComment} 
                        getCommentDate={getCommentDate} 
                    />
                ))
            )}
            {comments.length > 3 && (
                <Button onClick={() => setShowMoreComments(!showMoreComments)} className="ml-0 mt-2 bg-gray-600 text-white rounded p-2">
                    {showMoreComments ? "Show Less" : "Show More"}
                </Button>
            )}
        </div>
    );
};

export default CommentList;