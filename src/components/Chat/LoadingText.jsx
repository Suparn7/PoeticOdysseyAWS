import React from 'react';

const LoadingText = () => {
  return (
    <div className="chat-loading-text-container">
      <p className="chat-loading-text">
        {['L', 'o', 'a', 'd', 'i', 'n', 'g', '...'].map((letter, index) => (
          <span
            key={index}
            className="chat-loading-letter"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </p>
    </div>
  );
};

export default LoadingText;