import React from 'react';

const NotificationBadge = ({ notifications }) => {
    return (
            <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs rounded-full px-2 py-1 animate-bounce">
                {notifications.length}
            </span>
        )
    ;
};

export default NotificationBadge;