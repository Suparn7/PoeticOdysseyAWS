import React from 'react';
import './profile.css'

const ProfileBioSection = ({ isEditing, bio, handleBioChange }) => {
    return (
        <div className="w-full text-center bg-zinc-800 border-indigo-500 rounded-3xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl shadow-3xl">
            {isEditing ? (
                <textarea
                    value={bio}
                    onChange={handleBioChange}
                    className="text-md border-indigo-500 bg-transparent border-2 focus:outline-none resize-none overflow-y-auto scrollable-content rounded-lg transition duration-300 hover:scale-105"
                    style={{
                        background: "rgba(0,0,0,0.3)",
                        maxHeight: "150px",
                        color: "#fff",
                        width: "100%",
                        height: "80px",
                        padding: "8px",
                        borderRadius: "px",
                    }} // Limit height and allow scrolling
                />
            ) : (
                <div className="max-h-48 overflow-y-scroll scrollable-content">
                    <p className="text-md break-words ">
                        {bio}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfileBioSection;