import React from 'react';

const ProfileBioSection = ({ isEditing, bio, handleBioChange }) => {
    return (
        <div className="w-full border-indigo-500 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl">
            {isEditing ? (
                <textarea
                    value={bio}
                    onChange={handleBioChange}
                    className="text-md border-indigo-500 bg-transparent border-2 focus:outline-none resize-none overflow-y-auto rounded-lg transition duration-300 hover:scale-105"
                    style={{
                        background: "rgba(0,0,0,0.3)",
                        maxHeight: "150px",
                        color: "#fff",
                        width: "100%",
                        height: "80px",
                        padding: "8px",
                        borderRadius: "8px",
                    }} // Limit height and allow scrolling
                />
            ) : (
                <div className="max-h-48 overflow-y-auto">
                    <p className="text-md break-words">
                        {bio}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfileBioSection;