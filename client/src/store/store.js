import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import chatReducer from './slices/chatSlice';
import calendarReducer from './slices/calendarSlice';
import analyticsReducer from './slices/analyticsSlice';
import notificationReducer from './slices/notificationSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    chat: chatReducer,
    calendar: calendarReducer,
    analytics: analyticsReducer,
    notifications: notificationReducer,
    admin: adminReducer,
  },
});
