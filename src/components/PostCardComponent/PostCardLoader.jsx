import React from 'react';
import '../../styles/loader.css';

const PostCardLoader = ({ fadeOut }) => {
  return (
    <div className={`loader-overlay ${fadeOut ? 'hidden' : ''}`}>
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default PostCardLoader;