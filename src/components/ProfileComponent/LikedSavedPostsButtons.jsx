import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBookmark } from '@fortawesome/free-solid-svg-icons';

const LikedSavedPostsButtons = () => {
    return (
        <div className="mt-6 flex space-x-6 w-full">
            <Link to="/PoeticOdyssey/liked-posts" className="w-full">
                <button className="ml-1 w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-3xl shadow-3xl transform transition-all duration-300 hover:scale-110 hover:bg-red-700 hover:shadow-2xl hover:translate-y-1 hover:animate-pulse">
                    <FontAwesomeIcon icon={faHeart} className="text-2xl mr-2" />
                    Liked Posts
                </button>
            </Link>
            <Link to="/PoeticOdyssey/saved-posts" className="w-full">
                <button className="w-full mr-1 ml-0 bg-blue-600 text-white font-semibold py-2 px-4 rounded-3xl shadow-3xl transform transition-all duration-300 hover:scale-110 hover:bg-blue-700 hover:shadow-2xl hover:translate-y-1 hover:animate-pulse">
                    <FontAwesomeIcon icon={faBookmark} className="text-2xl mr-2" />
                    Saved Posts
                </button>
            </Link>
        </div>
    );
};

export default LikedSavedPostsButtons;