import React from 'react';

const PostImage = ({ post, imageLoading, setImageLoading }) => {
    return (
        <div className="flex justify-center mt-4">
            {imageLoading && <div className="loader"></div>}
            <img
                src={post.featuredImage}
                alt={post.title}
                className={`rounded-3xl transition-transform duration-500 ease-in-out w-1/2 ${
                    imageLoading ? 'hidden' : 'scale-100'
                } hover:scale-105`}
                onLoad={() => setImageLoading(false)}
            />
        </div>
    );
};

export default PostImage;