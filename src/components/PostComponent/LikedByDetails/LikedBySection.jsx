import React from 'react';

const LikedBySection = ({ likedByUsers, userData, handleShowModal }) => {
    return (
        <div className="mt-4 relative">
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                {likedByUsers && likedByUsers.length > 0 ? (
                    <>
                        <div className="flex flex-wrap items-center space-x-2">
                            <div className="flex -space-x-2">
                                {[...likedByUsers]
                                    .sort((a, b) =>
                                        a.userId === userData.userId ? -1 : b.userId === userData.userId ? 1 : 0
                                    )
                                    .slice(0, 3)
                                    .map((user, index) => (
                                        <img
                                            key={user.userId}
                                            src={user.profilePicUrl}
                                            alt={`${user.name}'s profile`}
                                            className="w-8 h-8 rounded-full border-2 border-gray-700 transform hover:scale-110 transition-all duration-200 ease-in-out"
                                        />
                                    ))}
                            </div>
                            <div className="text-gray-300 text-sm flex-1">
                                <span className="font-bold text-yellow-300">Liked by</span>{" "}
                                {[...likedByUsers]
                                    .sort((a, b) =>
                                        a.userId === userData.userId ? -1 : b.userId === userData.userId ? 1 : 0
                                    )
                                    .slice(0, 1)
                                    .map((user) => (
                                        <span key={user.userId}>
                                            {user.name}{" "}
                                            {user.userId === userData.userId && "(You)"}
                                        </span>
                                    ))}
                                {likedByUsers.length > 1 && (
                                    <>
                                        {" "}and{" "}
                                        <span
                                            onClick={handleShowModal}
                                            className="text-yellow-300 cursor-pointer hover:underline hover:text-yellow-400 transition-all duration-200 ease-in-out"
                                        >
                                            {likedByUsers.length - 1} others
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-gray-400 text-sm">No likes yet. Be the first to like this!</div>
                )}
            </div>
        </div>
    );
};

export default LikedBySection;