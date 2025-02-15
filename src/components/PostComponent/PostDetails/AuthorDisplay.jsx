import React from 'react';
import { Link } from 'react-router-dom';

const AuthorDisplay = ({ author }) => {
    return (
        <div
            className={`flex justify-center items-center text-left mb-2 p-1 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg text-white bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg transition-transform duration-300 transform hover:bg-gradient-to-l hover:scale-105 hover:shadow-xl`}
            style={{ padding: '10px 20px' }}
        >
            <Link to={`/PoeticOdyssey/profile/${author.userId}`} className="profile-link">
                <span className="text-lg font-bold text-white bg-clip-text">
                    Author: {author.name}
                </span>
            </Link>
        </div>
    );
};

export default AuthorDisplay;