import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationsState, NotificationItem } from '../../types';

const initialState: NotificationsState = {
  notifications: [],
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id'>>) => {
      const notification: NotificationItem = {
        id: Date.now().toString(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    showSuccess: (state, action: PayloadAction<string>) => {
      const notification: NotificationItem = {
        id: Date.now().toString(),
        type: 'success',
        message: action.payload,
        duration: 5000,
      };
      state.notifications.push(notification);
    },
    showError: (state, action: PayloadAction<string>) => {
      const notification: NotificationItem = {
        id: Date.now().toString(),
        type: 'error',
        message: action.payload,
        duration: 7000,
      };
      state.notifications.push(notification);
    },
    showWarning: (state, action: PayloadAction<string>) => {
      const notification: NotificationItem = {
        id: Date.now().toString(),
        type: 'warning',
        message: action.payload,
        duration: 6000,
      };
      state.notifications.push(notification);
    },
    showInfo: (state, action: PayloadAction<string>) => {
      const notification: NotificationItem = {
        id: Date.now().toString(),
        type: 'info',
        message: action.payload,
        duration: 4000,
      };
      state.notifications.push(notification);
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearAllNotifications,
  showSuccess,
  showError,
  showWarning,
  showInfo,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;