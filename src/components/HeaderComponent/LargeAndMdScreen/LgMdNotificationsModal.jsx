import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const LgMdNotificationsModal = ({ notificationsVisible, notificationRef, notifications, handleNotificationClick, handleDeleteNotification, notificationModalStyle }) => {
    return (
        notificationsVisible && (
            <div
                ref={notificationRef}
                className={`absolute right-0 mt-2 w-96 bg-gray-600 text-white rounded-lg shadow-xl z-50 transition-transform duration-300 transform scale-100 ${notificationModalStyle}`}
            >
                <ul className="notification-container flex flex-col space-y-2 p-4">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => {
                            return (
                                <li
                                    key={index}
                                    className="notification-item bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg hover:bg-gradient-to-l hover:scale-105 transition-all duration-500 ease-out flex items-center justify-between px-4 py-2"
                                >
                                    <span
                                        onClick={() => handleNotificationClick(notification.postId, notification.senderId)}
                                        className="flex-grow cursor-pointer"
                                    >
                                        {notification.message}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteNotification(notification.notificationId)}
                                        className="bg-gradient-to-r from-red-600 to-red-800 text-white ml-2 rounded-full px-4 py-2 transition-transform duration-300 hover:scale-110"
                                        aria-label="Delete notification"
                                    >
                                        <FontAwesomeIcon icon={faTrash} style={{ fontSize: '1.5rem' }} />
                                    </button>
                                </li>
                            );
                        })
                    ) : (
                        <li className="text-white text-center bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg px-4 py-2 transition-transform duration-300 hover:scale-105">
                            No notifications
                        </li>
                    )}
                </ul>
            </div>
        )
    );
};

export default LgMdNotificationsModal;