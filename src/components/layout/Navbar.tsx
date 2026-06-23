import { createSlice } from "@reduxjs/toolkit";

interface Notification {
    _id?: string;
    title: string;
    message: string;
    isRead?: boolean;
    createdAt?: string;
}

interface NotificationState {
    notifications: Notification[];
}

const initialState: NotificationState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },

        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        },

        markAsRead: (state, action) => {
            const notification = state.notifications.find(
                (n) => n._id === action.payload
            );

            if (notification) {
                notification.isRead = true;
            }
        },

        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const {
    setNotifications,
    addNotification,
    markAsRead,
    clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;