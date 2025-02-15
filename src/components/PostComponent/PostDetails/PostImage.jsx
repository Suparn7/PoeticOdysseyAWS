import React from 'react';

const PostImage = ({ post, imageLoading, setImageLoading }) => {
    return (
        <div className="flex justify-center mt-4">
            {imageLoading && <div className="loader"></div>}
            <img
                src={post.featuredImage}
                alt={post.title}
                className={`rounded-lg transition-transform duration-500 ease-in-out ${
                    imageLoading ? 'hidden' : 'scale-100'
                } hover:scale-105`}
                style={{ maxHeight: '300px', minWidth: '200px' }}
                onLoad={() => setImageLoading(false)}
            />
        </div>
    );
};

export default PostImage;