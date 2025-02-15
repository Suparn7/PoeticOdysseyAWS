import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherPointed } from '@fortawesome/free-solid-svg-icons';

const PostCardAuthor = ({ author }) => {
  return (
    <Link to={`/PoeticOdyssey/profile/${author.userId}`} className="profile-link">
      <div className="author">
        <FontAwesomeIcon icon={faFeatherPointed} className="mr-2" />
        {author.name}
      </div>
    </Link>
  );
};

export default PostCardAuthor;