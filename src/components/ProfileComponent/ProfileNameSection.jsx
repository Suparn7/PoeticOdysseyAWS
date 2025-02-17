import React from 'react';

const ProfileNameSection = ({ isEditing, name, handleNameChange }) => {
    return (
        <div className="text-center w-full mt-4">
            {isEditing ? (
                <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="text-2xl font-semibold text-gray-800 bg-transparent border-b-2 border-indigo-500 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full transform transition duration-300 hover:scale-105"
                    style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        background: "transparent",
                        padding: "4px",
                        color: "white",
                        width: "100%",
                    }}
                />
            ) : (
                <h1 className="text-3xl font-bold animate__animated animate__fadeIn">{name}</h1>
            )}
        </div>
    );
};

export default ProfileNameSection;