import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const EditProfileButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="absolute ml-0 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-lg flex items-center space-x-2 transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:animate-bounce"
            style={{
                position: "absolute",
                top: "16px",
                right: "10px",
                background: "#ffcc00",
                color: "#000",
                fontWeight: "600",
                padding: "5px 8px",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(255, 255, 255, 0.3)",
                transition: "transform 0.3s ease-in-out, background 0.3s ease-in-out",
            }}
        >
            <FontAwesomeIcon icon={faEdit} className="text-2xl" />
        </button>
    );
};

export default EditProfileButton;