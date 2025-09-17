import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import chatReducer from './slices/chatSlice';
import fileReducer from './slices/fileSlice';
import calendarReducer from './slices/calendarSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    chat: chatReducer,
    files: fileReducer,
    calendar: calendarReducer,
    analytics: analyticsReducer,
  },
});
