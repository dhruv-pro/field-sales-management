import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  _id?: string;
  title: string;
  message: string;
  isRead?: boolean;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },

    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n._id === action.payload,
      );

      if (notification) {
        notification.isRead = true;
      }
    },
  },
});

export const { setNotifications, addNotification, markAsRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;
