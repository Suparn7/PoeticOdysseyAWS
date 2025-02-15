import React from 'react';

const PostCardThemeToggle = ({ isDarkTheme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`ml-0 theme-toggle-btn ${isDarkTheme ? 'theme-toggle-btn-dark' : 'theme-toggle-btn-light'}`}
    >
      🌙
    </button>
  );
};

export default PostCardThemeToggle;