import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const NotificationBell = ({ notifications, notificationBellRef, handleNotificationToggle, getCreativeTitle }) => {
    return (
        <div className="relative">
            <button
                ref={notificationBellRef}
                className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
                onClick={handleNotificationToggle}
                aria-label="Toggle notifications"
                title={getCreativeTitle("Notification")}
            >
                <FontAwesomeIcon
                    icon={faBell}
                    className="text-3xl text-white cursor-pointer transform hover:scale-125 hover:rotate-12 transition-all duration-300 animate-pulse"
                    size="lg"
                />
            </button>

            {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1 animate-bounce">
                    {notifications.length}
                </span>
            )}
        </div>
    );
};

export default NotificationBell;