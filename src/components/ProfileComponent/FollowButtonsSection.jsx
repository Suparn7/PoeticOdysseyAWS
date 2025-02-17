import React from 'react';

const FollowButtonsSection = ({
    isAuthUser,
    isFollowing,
    isFollowingOrUnfollowing,
    handleFollowClick,
    fetchFollowing,
    fetchFollowers
}) => {
    return (
        <div className="flex space-x-4 mt-6">
            {/* Follow Button */}
            {!isAuthUser && (
                <button
                    onClick={handleFollowClick}
                    disabled={isFollowingOrUnfollowing}  // Disable button while action is in progress
                    style={{
                        background: isFollowing ? "#757575" : "#2196f3",
                        color: "#fff",
                        fontWeight: "600",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        marginRight: "2px",
                        transition: "transform 0.3s ease-in-out",
                        marginLeft: '5px'
                    }}
                >
                    {isFollowingOrUnfollowing ? (
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                            <path d="M4 12a8 8 0 0116 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" className="opacity-75" />
                        </svg>
                    ) : (
                        isFollowing ? 'Unfollow' : 'Follow'
                    )}
                </button>
            )}

            {/* Following Button */}
            <button onClick={() => fetchFollowing()}
                style={{
                    background: "#43a047",
                    color: "#fff",
                    fontWeight: "600",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    marginRight: "2px",
                    marginLeft: '5px'
                }}>
                Following
            </button>

            {/* Followers Button */}
            <button onClick={() => fetchFollowers()}
                style={{
                    background: "#7b1fa2",
                    color: "#fff",
                    fontWeight: "600",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    marginLeft: '5px'
                }}>
                Followers
            </button>
        </div>
    );
};

export default FollowButtonsSection;