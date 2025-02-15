import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUserNotification, deleteUserNotification } from "../../../store/notificationSlice";
import useWebSocketService from '../../../webSocketServices/useWebSocketService';

const useWebSocketNotifications = (userData, notifications, setNotifications) => {
    const [notificationSocketUrl, setNotificationSocketUrl] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userData?.userId) {
            setNotificationSocketUrl(`wss://l8eegkbrkd.execute-api.ap-south-1.amazonaws.com/production/?userId=${userData.userId}`);
        }
    }, [userData]);

    const { sendJsonMessage: sendNotificationJsonMessage, lastJsonMessage: lastNotificationJsonMessage } = useWebSocketService(notificationSocketUrl);

    useEffect(() => {
        if (lastNotificationJsonMessage !== null) {
            console.log('Received message:', lastNotificationJsonMessage);

            if (lastNotificationJsonMessage.data.userId !== userData.userId) {
                const existingNotification = notifications.find((noti) => noti.notificationId === lastNotificationJsonMessage.data.notificationId);

                if (!existingNotification) {
                    setNotifications((prevNoti) => [...prevNoti, lastNotificationJsonMessage.data]);
                    dispatch(addUserNotification(lastNotificationJsonMessage.data));
                } else {
                    console.log("Duplicate notification detected, not adding to state.");
                }
            }

            if (lastNotificationJsonMessage.action === 'removeNotification') {
                const { notificationId } = lastNotificationJsonMessage.data;
                setNotifications((prevNotifications) => {
                    const notificationExists = prevNotifications.some(notification => notification.notificationId === notificationId);
                    if (!notificationExists) {
                        return prevNotifications;
                    }
                    dispatch(deleteUserNotification(notificationId));
                    return prevNotifications.filter((notification) => notification.notificationId !== notificationId);
                });
            }
        }
    }, [lastNotificationJsonMessage]);

    return { sendNotificationJsonMessage };
};

export default useWebSocketNotifications;