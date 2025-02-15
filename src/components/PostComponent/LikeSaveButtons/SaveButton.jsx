import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../../Button';

const SaveButton = ({ savedByUser, handleSave }) => {
    return (
        <div className="relative">
            <Button
                onClick={handleSave}
                className={`relative p-4 rounded-full transition-transform duration-300 hover:scale-125 cursor-pointer ${
                    savedByUser ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
            >
                <FontAwesomeIcon
                    icon={faBookmark}
                    className={`text-white text-xl transition-transform ${savedByUser ? 'animate-bookmark-slide' : ''}`}
                />
            </Button>
            {savedByUser && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    {/* Sparkle Animation */}
                    <div className="relative">
                        <span className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-sparkle top-0 left-[10%]"></span>
                        <span className="absolute w-3 h-3 bg-yellow-300 rounded-full animate-sparkle top-[50%] right-[10%]"></span>
                        <span className="absolute w-2 h-2 bg-yellow-200 rounded-full animate-sparkle bottom-0 left-[40%]"></span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaveButton;