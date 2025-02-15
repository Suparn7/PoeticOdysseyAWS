import React from 'react';

const PostCardImage = ({ featuredImage, title }) => {
  return (
    <div className="image-container">
      <img
        src={featuredImage}
        alt={title}
        className="featured-image"
      />
    </div>
  );
};

export default PostCardImage;