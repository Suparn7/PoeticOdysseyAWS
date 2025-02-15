import { addUserNotification, deleteUserNotification, setUserNotifications } from "../store/notificationSlice";
import dynamoService from '../aws/dynamoService';

export const handleMenuToggle = (setMenuVisible, setNotificationsVisible, setNotificationsVisibleForSmallScreen, menuVisible, notificationsVisible, notificationsVisibleForSmallScreen) => {
    if (notificationsVisible) setNotificationsVisible(false);
    if (notificationsVisibleForSmallScreen) setNotificationsVisibleForSmallScreen(false);
    setMenuVisible(!menuVisible);
};

export const handleNotificationToggle = (setNotificationsVisible, setMenuVisible, notificationsVisible, menuVisible) => {
    setNotificationsVisible(!notificationsVisible);
    if (menuVisible) setMenuVisible(false);
};

export const handleNotificationToggleForSmallScreen = (setNotificationsVisibleForSmallScreen, setMenuVisible, notificationsVisibleForSmallScreen, menuVisible) => {
    setNotificationsVisibleForSmallScreen(!notificationsVisibleForSmallScreen);
    if (menuVisible) setMenuVisible(false);
};

export const handleClickOutside = (event, menuRef, notificationRef, notificationRefForSmScreen, notificationBellRef, notificationBellRefForSmScreen, setMenuVisible, setNotificationsVisible, setNotificationsVisibleForSmallScreen, menuVisible, notificationsVisible, notificationsVisibleForSmallScreen) => {
    if (menuVisible && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
    }
    if (notificationsVisible && notificationRef.current && !notificationRef.current.contains(event.target) && (!notificationBellRef.current || !notificationBellRef.current.contains(event.target))) {
        setNotificationsVisible(false);
    }
    if (notificationsVisibleForSmallScreen && notificationRefForSmScreen.current && !notificationRefForSmScreen.current.contains(event.target) && (!notificationBellRefForSmScreen.current || !notificationBellRefForSmScreen.current.contains(event.target))) {
        setNotificationsVisibleForSmallScreen(false);
    }
};

export const getCreativeTitle = (itemName) => {
    switch (itemName) {
        case "Home":
            return "Embark on a Poetic Journey";
        case "Login":
            return "Unlock the Realm of Words";
        case "Signup":
            return "Join Our Literary Constellation";
        case "Add Post":
            return "Share Your Poetic Soul";
        case "My Posts":
            return "Reflect on Your Literary Footprints";
        case "Profile":
            return "Explore Your Creative Universe";
        case "Chats":
            return "Whispers Among Wordsmiths";
        case "Logout":
            return "Bid Adieu to the Muse";
        case "Notification":
            return "Ding Ding! Whispers in the Wind";
        default:
            return `Navigate to ${itemName}`;
    }
};

export const handleNavigation = (slug, navigate, setMenuVisible, setNotificationsVisible) => {
    navigate(slug);
    window.scrollTo(0, 0);
    setMenuVisible(false);
    setNotificationsVisible(false);
};

export const handleNotificationClick = (postId, fromUserId, navigate, setNotificationsVisible, setNotificationsVisibleForSmallScreen, setMenuVisible) => {
    if (postId !== undefined) {
        navigate(`/PoeticOdyssey/post/${postId}`);
    } else {
        navigate(`/PoeticOdyssey/profile/${fromUserId}`);
    }
    setNotificationsVisible(false);
    setNotificationsVisibleForSmallScreen(false);
    setMenuVisible(false);
};

export const handleDeleteNotification = async (notificationId, userData, setDeletingNotification, notifications, setNotifications, setNotificationsVisible, dispatch) => {
    const userId = userData.userId;
    setDeletingNotification(notificationId);

    const result = await dynamoService.deleteNotification(userId, notificationId);
    const updatedNotifications = notifications.filter(noti => noti.notificationId !== notificationId);

    if (updatedNotifications.length === 0) {
        setNotificationsVisible(false);
    }

    setNotifications(updatedNotifications);

    if (result) {
        dispatch(deleteUserNotification(notificationId));
    }

    setTimeout(() => setDeletingNotification(null), 1000);
};

export const fetchInitialNotifications = async (userData, setNotifications, dispatch, setLoading) => {
    try {
        const initialNotifications = await dynamoService.fetchNotifications(userData.userId);
        setNotifications(initialNotifications);
        dispatch(setUserNotifications(initialNotifications));
        setLoading(false);
    } catch (error) {
        console.error('Error fetching initial notifications:', error);
        setLoading(false);
    }
};