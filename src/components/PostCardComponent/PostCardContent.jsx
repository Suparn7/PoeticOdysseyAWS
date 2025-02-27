import React from 'react';
import parse from 'html-react-parser';

const PostCardContent = ({ content }) => {
  return (
    <div className="content">
      <div className='w-full' >
        {parse(content.length > 100 ? `${content.substring(0, 50)}...` : content)}  
      </div>
    </div>
  );
};

export default PostCardContent;