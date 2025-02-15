import React from 'react';
import Button from '../../Button';

const CommentForm = ({ newComment, setNewComment, handleCommentSubmit }) => {
    return (
        <form onSubmit={handleCommentSubmit} className="flex flex-col mt-4 p-4 bg-black bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg">
            <textarea
                id="commentTextarea"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="p-2 rounded-lg bg-gray-800 text-white resize-none h-24 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-700"
            />
            <div className="flex justify-center mt-2">
                <Button 
                    type="submit" 
                    className="w-full text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-lg transition-transform duration-300 transform hover:bg-gradient-to-l hover:scale-105 hover:shadow-xl py-2"
                >
                    Post
                </Button>
            </div>
        </form>
    );
};

export default CommentForm;