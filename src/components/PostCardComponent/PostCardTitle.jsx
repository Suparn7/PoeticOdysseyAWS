import React from 'react';

const PostCardTitle = ({ title }) => {
  return (
    <h2 className="post-title">{title.length > 15 ? `${title.substring(0, 15)}...` : title}</h2>
  );
};

export default PostCardTitle;