import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';

const NotificationButton = ({ notificationBellRef, handleNotificationToggle, getCreativeTitle }) => {
    return (
        <Tippy
            key={"Notification"}
            content={<span className="animate-pulse w-16 text-white">{getCreativeTitle("Notification")}</span>}
            placement="right"
            theme="dark"
            interactive={true}
            delay={[100, 0]}
        >
            <button
                ref={notificationBellRef}
                className="relative flex items-center justify-center w-12 h-12 ml-0 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
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
        </Tippy>
    );
};

export default NotificationButton;