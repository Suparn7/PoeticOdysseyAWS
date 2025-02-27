import React from 'react';

const PostTitle = ({ title }) => {
    return (
        <h1 className="text-xl font-bold text-yellow-300 my-4 text-center break-words shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
            {title}
        </h1>
    );
};

export default PostTitle;