import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Button from '../../Button';

const LikeButton = ({ likedByUser, handleLike }) => {
    return (
        <div className="relative">
            <Button
                onClick={handleLike}
                className={`p-4 rounded-full transition-transform duration-300 hover:scale-125 ${
                    likedByUser ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
                <FontAwesomeIcon
                    icon={faHeart}
                    className={`text-white text-xl ${likedByUser ? 'animate-bounce' : ''}`}
                />
            </Button>
            {likedByUser && (
                <div className="absolute top-[-20px] left-[50%] transform -translate-x-[50%]">
                    {/* Heart Explosion Animation */}
                    <span className="block w-4 h-4 bg-red-500 rounded-full animate-heart-explode"></span>
                    <span className="block w-3 h-3 bg-red-400 rounded-full animate-heart-explode"></span>
                </div>
            )}
        </div>
    );
};

export default LikeButton;