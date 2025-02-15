import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const LikedByModal = ({ isModalOpen, handleCloseModal, likedByUsers, userData, visibleUsers, handleShowMore }) => {
    return (
        isModalOpen && (
            <div className="fixed top-80 left-0 w-full h-full bg-black bg-opacity-0 flex justify-center items-center z-50">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-2xl w-80">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl text-yellow-300">Liked By</h2>
                        <FontAwesomeIcon
                            icon={faTimes}
                            onClick={handleCloseModal}
                            className="relative top-0 text-yellow-300 cursor-pointer hover:text-yellow-400 transition-all duration-300 ease-in-out"
                            size="lg"
                        />
                    </div>
                    <ul className="text-sm text-gray-300 space-y-2">
                        {[...likedByUsers]
                            .sort((a, b) =>
                                a.userId === userData.userId ? -1 : b.userId === userData.userId ? 1 : 0
                            ).slice(0, visibleUsers)
                            .map((user, index) => (
                                <li
                                    key={index}
                                    className="flex items-center space-x-3 hover:text-yellow-300 cursor-pointer transform hover:scale-105 transition-all duration-200 ease-in-out"
                                >
                                    <img
                                        src={user.profilePicUrl}
                                        alt={`${user.name}'s profile`}
                                        className="w-8 h-8 rounded-full border-2 border-gray-700"
                                    />
                                    <Link
                                        to={`/PoeticOdyssey/profile/${user.userId}`}
                                        className="text-white"
                                    >
                                        {user.name} {user.userId === userData.userId && "(You)"}
                                    </Link>
                                </li>
                            ))}
                    </ul>
                    {likedByUsers.length > visibleUsers && (
                        <button
                            onClick={handleShowMore}
                            className="ml-0 mt-4 w-full py-2 bg-yellow-300 text-gray-800 rounded-lg hover:bg-yellow-400 transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
        )
    );
};

export default LikedByModal;