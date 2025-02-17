import React from 'react';

const UserSearchSection = ({ searchQuery, handleSearchChange, filteredUsers, showMore, setShowMore, handleUserSelect }) => {
  return (
    <div className="search-section" style={{ minWidth: "100%" }}>
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="searchInput text-black"
      />
      <p>No chats available. Select a user to start a chat.</p>
      <ul className="user-list">
        {filteredUsers && filteredUsers.slice(0, showMore ? filteredUsers.length : 5).map((user) => (
          <li className="user-card break-words" key={user.userId} onClick={() => handleUserSelect(user.userId)}>
            <img src={user.profilePicUrl} alt={user.name} className="profile-pic" />
            <span>{user.name}</span>
          </li>
        ))}
      </ul>
      {!showMore && filteredUsers.length > 5 && (
        <button onClick={() => setShowMore(true)}>Show More Users</button>
      )}
    </div>
  );
};

export default UserSearchSection;