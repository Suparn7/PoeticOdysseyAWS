import React from 'react';

const HamburgerMenuButton = ({ handleMenuToggle }) => {
    return (
        <button
            className="flex items-center justify-center w-14 h-14 bg-gradient-to-l from-indigo-500 to-purple-600 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
            onClick={handleMenuToggle}
            aria-label="Toggle navigation"
        >
            ☰
        </button>
    );
};

export default HamburgerMenuButton;