import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import calendarService from '../../services/calendarService';

// Async thunks
export const fetchCalendarData = createAsyncThunk(
  'calendar/fetchCalendarData',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await calendarService.getCalendarData(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch calendar data');
    }
  }
);

const initialState = {
  calendarEntries: [],
  totalProjects: 0,
  totalTasks: 0,
  isLoading: false,
  error: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    clearCalendarError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCalendarData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.calendarEntries = action.payload.calendarEntries;
        state.totalProjects = action.payload.totalProjects;
        state.totalTasks = action.payload.totalTasks;
        state.error = null;
      })
      .addCase(fetchCalendarData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCalendarError } = calendarSlice.actions;
export default calendarSlice.reducer;
