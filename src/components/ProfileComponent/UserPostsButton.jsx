import React from 'react';
import { Link } from 'react-router-dom';

const UserPostsButton = ({ profileId, name }) => {
    return (
        <div className="mt-6">
            <Link to={`/PoeticOdyssey/user-posts/${profileId.slug}`} className="w-full">
                <button className="w-full bg-teal-900 text-white font-semibold py-2 px-4 rounded-3xl shadow-3xl transform transition-all duration-300 hover:scale-110 hover:bg-teal-900 hover:shadow-2xl hover:translate-y-1 hover:animate-pulse">
                    Posts by {name}
                </button>
            </Link>
        </div>
    );
};

export default UserPostsButton;