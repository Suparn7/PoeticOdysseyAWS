import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faBan } from '@fortawesome/free-solid-svg-icons';

const SaveCancelButtons = ({ onSaveClick, onCancelClick }) => {
    return (
        <div className="absolute top-4 right-4 flex items-center space-x-4">
            <button
                onClick={onSaveClick}
                className="ml-0 flex items-center justify-center text-white rounded-full shadow-lg transition duration-300 transform hover:scale-110 hover:shadow-2xl focus:outline-none hover:animate-bounce"
                style={{
                    background: "linear-gradient(135deg, #4caf50, #81c784)",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "50%",
                    marginRight: "-8px",
                    boxShadow: "0 4px 10px rgba(255, 255, 255, 0.3)",
                    transition: "transform 0.3s ease-in-out",
                }}
            >
                <FontAwesomeIcon icon={faFloppyDisk} className="text-2xl" />
            </button>
            <button
                onClick={onCancelClick}
                className="ml-0 flex items-center justify-center text-white rounded-full shadow-lg transition duration-300 transform hover:scale-110 hover:shadow-2xl focus:outline-none hover:animate-bounce"
                style={{
                    background: "#e53935",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "50%",
                    marginRight: '0px',
                    marginLeft: '10px',
                    boxShadow: "0 4px 10px rgba(255, 255, 255, 0.3)",
                    transition: "transform 0.3s ease-in-out",
                }}
            >
                <FontAwesomeIcon icon={faBan} className="text-2xl" />
            </button>
        </div>
    );
};

export default SaveCancelButtons;