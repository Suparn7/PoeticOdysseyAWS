import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: []
    },
    reducers: {
        setUserNotifications(state, action) {
            state.notifications = action.payload;
        },
        
        addUserNotification(state, action) {
            state.notifications.unshift(action.payload);
        },
        deleteUserNotification(state, action) {
            state.notifications = state.notifications.filter(
                (notification) => notification.notificationId !== action.payload
            );
        },
        clearUserNotification(state) {
            state.notifications = [];
        }
    },
    
});

export const { setUserNotifications, addUserNotification, deleteUserNotification, clearUserNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;
