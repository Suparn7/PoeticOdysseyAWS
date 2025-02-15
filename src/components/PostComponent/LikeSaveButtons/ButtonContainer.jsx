import React from 'react';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';

const ButtonContainer = ({ likedByUser, handleLike, savedByUser, handleSave }) => {
    return (
        <div className="top-3 relative flex space-x-4 bg-gradient-to-br from-black via-gray-800 to-gray-900 bg-opacity-70 p-4 rounded-[2.5rem] shadow-xl border-2 border-gray-700 transition-all duration-500 hover:scale-105 hover:rotate-[1deg]">
            <LikeButton likedByUser={likedByUser} handleLike={handleLike} />
            <SaveButton savedByUser={savedByUser} handleSave={handleSave} />
        </div>
    );
};

export default ButtonContainer;