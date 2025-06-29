import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import projectsReducer from './features/projects/projectsSlice';
import tasksReducer from './features/tasks/tasksSlice';
import uiReducer from './features/ui/uiSlice';
import notificationsReducer from './features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    ui: uiReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;