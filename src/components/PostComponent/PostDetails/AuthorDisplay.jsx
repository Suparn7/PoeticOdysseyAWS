import { faBookOpen, faFeather, faPenFancy, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

const AuthorDisplay = ({ author }) => {
    return (
        <div
  className={`flex justify-evenly items-center text-left mb-2 p-1 bg-white bg-opacity-10 backdrop-blur-3xl rounded-3xl text-neutral-200 bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg transition-transform duration-300 transform hover:bg-gradient-to-l hover:scale-105 hover:shadow-xl`}
>
  <FontAwesomeIcon icon={faPenFancy} className="mr-2 text-xl text-neutral-200" />
  <Link to={`/PoeticOdyssey/profile/${author.userId}`} className="profile-link">
    <span className="text-sm font-bold bg-clip-text text-neutral-200">
      Author: {author.name}
    </span>
  </Link>
  <FontAwesomeIcon icon={faBookOpen} className="ml-2 text-xl text-neutral-200" />
</div>

    );
};

export default AuthorDisplay;