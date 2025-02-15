import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import dynamoService from '../../../aws/dynamoService';
import { setUserNotifications } from '../../../store/notificationSlice';

const useInitialNotifications = (userData, setNotifications) => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userData && userData.userId) {
            const fetchInitialNotifications = async () => {
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

            fetchInitialNotifications();
        }
    }, [userData]);

    return { loading };
};

export default useInitialNotifications;