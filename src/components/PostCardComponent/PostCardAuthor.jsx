import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherPointed, faPenFancy } from '@fortawesome/free-solid-svg-icons';

const PostCardAuthor = ({ author }) => {
  return (
    <Link to={`/PoeticOdyssey/profile/${author.userId}`} className="profile-link">
      <div className="author flex justify-center items-center">
        <FontAwesomeIcon icon={faPenFancy} className="mr-2 text-xl" />
        <img src={author.profilePicUrl} alt={author.name} className="w-6 h-6 rounded-full bg-cover p-0.5" />
        {author.name}
      </div>
    </Link>
  );
};

export default PostCardAuthor;
