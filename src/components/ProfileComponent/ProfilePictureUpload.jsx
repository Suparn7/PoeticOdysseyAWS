import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const ProfilePictureUpload = ({ profilePicUrl, isEditing, handleProfilePicChange }) => {
    return (
        <div className="relative">
            <img
                src={profilePicUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-lg transform transition-transform duration-300 hover:scale-110 hover:rotate-6 hover:shadow-2xl hover:animate-spin-slow"
            />
            {isEditing && (
                <label htmlFor="profilePicUpload" className="absolute bottom-0 right-0 bg-indigo-500 rounded-full p-2 cursor-pointer shadow-lg hover:opacity-100 transition-all duration-300 hover:scale-125">
                    <FontAwesomeIcon icon={faCamera} className="text-white text-xl" />
                </label>
            )}
            <input
                type="file"
                id="profilePicUpload"
                onChange={handleProfilePicChange}
                className="hidden"
            />
        </div>
    );
};

export default ProfilePictureUpload;