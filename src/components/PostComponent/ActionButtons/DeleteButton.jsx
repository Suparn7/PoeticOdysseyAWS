import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../../Button';

const DeleteButton = ({ confirmDelete }) => {
    return (
        <Button
            className="group relative flex items-center justify-center p-4 bg-gradient-to-r from-red-500 via-orange-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-110"
            onClick={confirmDelete}
        >
            <FontAwesomeIcon
                icon={faTrash}
                className="text-white text-2xl group-hover:scale-125 transform transition-transform duration-300"
            />
            {/* Ripple Effect */}
            <span className="absolute w-0 h-0 bg-white opacity-30 rounded-full group-hover:w-20 group-hover:h-20 transition-all duration-300"></span>
        </Button>
    );
};

export default DeleteButton;