import React from 'react';

const SmNotificationsModal = ({ notificationsVisible, notificationRef, notifications, handleNotificationClick, handleDeleteNotification }) => {
    return (
        notificationsVisible && (
            <div
                ref={notificationRef}
                className="absolute min-w-80 bg-gray-800 bg-opacity-90 text-white rounded-lg shadow-lg p-4 top-full left-3/4 transform -translate-x-full mt-2 z-50 max-w-xs w-full"
            >
                <ul className="flex flex-col space-y-2">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => {
                            return (
                                <li
                                    key={index}
                                    className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg px-4 py-2 shadow hover:scale-105 transition-transform duration-300"
                                >
                                    <span
                                        onClick={() => handleNotificationClick(notification.postId, notification.senderId)}
                                        className="flex-grow cursor-pointer"
                                    >
                                        {notification.message}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteNotification(notification.notificationId)}
                                        className="bg-red-600 text-white rounded-full px-2 py-1 hover:bg-red-700 transition-transform duration-300 hover:scale-110"
                                        aria-label="Delete notification"
                                    >
                                        🗑
                                    </button>
                                </li>
                            );
                        })
                    ) : (
                        <li className="text-center bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg px-4 py-2">
                            No notifications
                        </li>
                    )}
                </ul>
            </div>
        )
    );
};

export default SmNotificationsModal;