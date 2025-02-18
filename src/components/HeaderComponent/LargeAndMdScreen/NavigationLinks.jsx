import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';

const NavigationLinks = ({ navItems, getCreativeTitle, handleNavigation }) => {
    return (
        <div className="flex items-center space-x-6">
            {navItems.map((item) =>
                item.active ? (
                    <Tippy
                        key={item.slug}
                        content={
                            <span className="whitespace-nowrap animate-pulse w-auto text-slate-200 bg-gray-800 p-2 rounded-lg shadow-lg">
                                {getCreativeTitle(item.name)}
                            </span>
                        } 
                        placement="top" // Adjust placement as needed (top, bottom, left, right)
                        theme="dark"   // Choose a theme (optional)
                        interactive={true} // Allow interaction within the tooltip
                        delay={[300, 0]}    // Show delay (ms), hide delay (ms)
                    >
                        <button
                            href={item.slug}
                            className="group ml-0 mr-0 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full shadow-xl px-5 py-3 transition-all duration-300 ease-in-out hover:bg-gradient-to-l hover:scale-110 hover:rotate-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center space-x-3"
                            onClick={() => handleNavigation(item.slug)}
                        >
                            <FontAwesomeIcon icon={item.icon} className="text-2xl" />
                        </button>
                    </Tippy>
                ) : null
            )}
        </div>
    );
};

export default NavigationLinks;