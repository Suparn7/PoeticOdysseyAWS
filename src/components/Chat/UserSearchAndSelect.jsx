import React from 'react';

const UserSearchAndSelect = ({ searchQuery, handleSearchChange, filteredUsers, showMore, setShowMore, handleUserSelect }) => {
  return (
    <div className="search-section">
      <p className="search-text">Search Users to Start Chatting</p>
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="searchInput text-black"
      />
      <ul className="user-list">
        {searchQuery &&
          filteredUsers.slice(0, showMore ? filteredUsers.length : 5).map((user) => (
            <li key={user.userId} className="user-card" onClick={() => handleUserSelect(user.userId)}>
              <div className="profile-pic-container">
                <img
                  src={user.profilePicUrl || "https://avatar.iran.liara.run/public/boy?username=Ash"}  // Fallback to placeholder if no profile picture
                  alt={user.name}
                  className="profile-pic"
                />
              </div>
              <span className="user-name">{user.name}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UserSearchAndSelect;