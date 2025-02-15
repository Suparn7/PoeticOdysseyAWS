import React from 'react';
import Button from '../../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const CommentItem = ({ comment, isAuthor, userData, deleteComment, getCommentDate }) => {
    return (
        <div className="relative animate-fadeIn break-words bg-white bg-opacity-30 backdrop-blur-lg border border-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-start max-w-80">
                <p className="text-gray-300 font-semibold">
                    <strong>
                        {comment.userName} {comment.userId === userData.userId && "(You)"}
                    </strong>
                </p>
                {(isAuthor || userData.userId === comment.userId) && (
                    <Button 
                        onClick={() => deleteComment(comment)} 
                        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                )}
            </div>
            <span className="text-gray-400 text-sm">
                {getCommentDate(new Date(comment.createdAt))}, {new Date(comment.createdAt).toLocaleTimeString()}
            </span>
            <p className="text-gray-300 mt-1 break-words">{comment.text}</p>
        </div>
    );
};

export default CommentItem;