import React from 'react';
import Tippy from '@tippyjs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoutBtn from '../LogoutBtn';

const MenuModal = ({ navItems, getCreativeTitle, handleNavigation, authStatus, handleMenuToggle }) => {
    return (
        <div className="absolute right-0 mt-24 -top-3 bg-gray-800 bg-opacity-90 rounded-3xl shadow-2xl p-6 z-50 max-w-md animate-fade-in">
            <ul className="flex flex-col">
                {navItems.map((item) =>
                    item.active ? (
                        <Tippy
                            key={item.slug}
                            content={<span className="animate-pulse text-white">{getCreativeTitle(item.name)}</span>} // Use a span for animation
                            placement="left" // Adjust placement as needed (top, bottom, left, right)
                            theme="dark"   // Choose a theme (optional)
                            interactive={true} // Allow interaction within the tooltip
                            delay={[100, 0]}    // Show delay (ms), hide delay (ms)
                        >
                            <button
                                href={item.slug}
                                className="group text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full shadow-xl px-6 py-3 transition-all duration-300 ease-in-out hover:bg-gradient-to-l hover:scale-110 hover:rotate-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center space-x-3"
                                onClick={() => handleNavigation(item.slug)}
                            >
                                <FontAwesomeIcon icon={item.icon} className="text-2xl" />
                            </button>
                        </Tippy>
                    ) : null
                )}
                {authStatus && (
                    <li className="animate-slide-in">
                        <LogoutBtn handleMenuToggle={handleMenuToggle} title={getCreativeTitle("Logout")} />                                        
                    </li>
                )}
            </ul>
        </div>
    );
};

export default MenuModal;