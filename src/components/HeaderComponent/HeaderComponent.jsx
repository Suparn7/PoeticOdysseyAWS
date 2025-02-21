import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HeaderContent from './HeaderContent';
import {
    handleMenuToggle,
    handleNotificationToggle,
    handleNotificationToggleForSmallScreen,
    handleClickOutside,
    getCreativeTitle,
    handleNavigation,
    handleNotificationClick,
    handleDeleteNotification
} from '../../actions/headerActions';

import './styles/headerStyles.css'; // Import the new CSS file
import useWebSocketNotifications from './Hooks/useWebSocketNotifications';
import useInitialNotifications from './Hooks/useInitialNotifications';
import navItemsConfig from './config/navItemsConfig';
import { addUserNotification, deleteUserNotification } from '../../store/notificationSlice';
import CallModal from '../Chat/CallModal';
import CallingModal from './CallingModal';

const HeaderComponent = ({ sendJsonMessage, lastJsonMessage, readyState, peer }) => {
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.user.userData);
    const [notifications, setNotifications] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [notificationsVisible, setNotificationsVisible] = useState(false);
    const [notificationsVisibleForSmallScreen, setNotificationsVisibleForSmallScreen] = useState(false);
    const [deletingNotification, setDeletingNotification] = useState(null);

    const menuRef = useRef(null);
    const notificationRef = useRef(null);
    const notificationRefForSmScreen = useRef(null);
    const notificationBellRef = useRef(null);
    const notificationBellRefForSmScreen = useRef(null);
    const [isCallModalOpen, setIsCallModalOpen] = useState(false);
    const [peersToCall, setPeersToCall] = useState(null);

    const navItems = navItemsConfig(authStatus);

    const { loading } = useInitialNotifications(userData, setNotifications);

    useEffect(() => {
        document.addEventListener('mousedown', (event) => handleClickOutside(event, menuRef, notificationRef, notificationRefForSmScreen, notificationBellRef, notificationBellRefForSmScreen, setMenuVisible, setNotificationsVisible, setNotificationsVisibleForSmallScreen, menuVisible, notificationsVisible, notificationsVisibleForSmallScreen));
        return () => {
            document.removeEventListener('mousedown', (event) => handleClickOutside(event, menuRef, notificationRef, notificationRefForSmScreen, notificationBellRef, notificationBellRefForSmScreen, setMenuVisible, setNotificationsVisible, setNotificationsVisibleForSmallScreen, menuVisible, notificationsVisible, notificationsVisibleForSmallScreen));
        };
    }, [menuVisible, notificationsVisible, notificationsVisibleForSmallScreen]);

    useEffect(() => {
        if (lastJsonMessage !== null) {
            console.log('Received message:', lastJsonMessage);

            if (lastJsonMessage.data?.userId !== userData?.userId) {
                const existingNotification = notifications.find((noti) => noti?.notificationId === lastJsonMessage?.data?.notificationId);

                if (!existingNotification) {
                    setNotifications((prevNoti) => [...prevNoti, lastJsonMessage.data]);
                    dispatch(addUserNotification(lastJsonMessage?.data));
                } else {
                    console.log("Duplicate notification detected, not adding to state.");
                }
            }

            if (lastJsonMessage?.action === 'removeNotification') {
                const { notificationId } = lastJsonMessage?.data;
                setNotifications((prevNotifications) => {
                    const notificationExists = prevNotifications.some(notification => notification.notificationId === notificationId);
                    if (!notificationExists) {
                        return prevNotifications;
                    }
                    dispatch(deleteUserNotification(notificationId));
                    return prevNotifications.filter((notification) => notification.notificationId !== notificationId);
                });
            }

            if (lastJsonMessage?.action === 'sendCall') {
                setIsCallModalOpen(true);
                setPeersToCall(lastJsonMessage?.data);
            };
        }
    }, [lastJsonMessage]);

    return (
        <>
            {/* Call Modal */}
            {isCallModalOpen && (
                <>
                    <CallingModal
                        peer={peer}
                        peersToCall={peersToCall}
                        onClose={() => setIsCallModalOpen(false)}
                        sendJsonMessage={sendJsonMessage}
                        lastJsonMessage={lastJsonMessage}
                        userID={userData.userId}
                    />
                </>
            )}
            <div className="header-container">
                <HeaderContent
                    navItems={navItems}
                    getCreativeTitle={getCreativeTitle}
                    handleNavigation={(slug) => handleNavigation(slug, navigate, setMenuVisible, setNotificationsVisible)}
                    authStatus={authStatus}
                    notificationRef={notificationRef}
                    notificationBellRef={notificationBellRef}
                    handleNotificationToggle={() => handleNotificationToggle(setNotificationsVisible, setMenuVisible, notificationsVisible, menuVisible)}
                    notifications={notifications}
                    notificationsVisible={notificationsVisible}
                    handleNotificationClick={(postId, fromUserId) => handleNotificationClick(postId, fromUserId, navigate, setNotificationsVisible, setNotificationsVisibleForSmallScreen, setMenuVisible)}
                    handleDeleteNotification={(notificationId) => handleDeleteNotification(notificationId, userData, setDeletingNotification, notifications, setNotifications, setNotificationsVisible, dispatch)}
                    notificationModalStyle="notification-modal" // Use the CSS class instead of inline styles
                    menuRef={menuRef}
                    notificationBellRefForSmScreen={notificationBellRefForSmScreen}
                    handleNotificationToggleForSmallScreen={() => handleNotificationToggleForSmallScreen(setNotificationsVisibleForSmallScreen, setMenuVisible, notificationsVisibleForSmallScreen, menuVisible)}
                    notificationsVisibleForSmallScreen={notificationsVisibleForSmallScreen}
                    notificationRefForSmScreen={notificationRefForSmScreen}
                    handleMenuToggle={() => handleMenuToggle(setMenuVisible, setNotificationsVisible, setNotificationsVisibleForSmallScreen, menuVisible, notificationsVisible, notificationsVisibleForSmallScreen)}
                    menuVisible={menuVisible}
                />
            </div>
        </>
    );
};

export default HeaderComponent;