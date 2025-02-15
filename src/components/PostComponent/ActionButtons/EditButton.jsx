import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Button from '../../Button';

const EditButton = ({ postId }) => {
    return (
        <Link to={`/PoeticOdyssey/edit-post/${postId}`}>
            <Button
                className="group relative flex items-center justify-center p-4 bg-gradient-to-r from-green-400 via-teal-500 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-110"
            >
                <FontAwesomeIcon
                    icon={faEdit}
                    className="text-white text-2xl group-hover:scale-125 transform transition-transform duration-300"
                />
                {/* Ripple Effect */}
                <span className="absolute w-0 h-0 bg-white opacity-30 rounded-full group-hover:w-20 group-hover:h-20 transition-all duration-300"></span>
            </Button>
        </Link>
    );
};

export default EditButton;