import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../../services/analyticsService';

// Async thunks
export const fetchProjectAnalytics = createAsyncThunk(
  'analytics/fetchProjectAnalytics',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getProjectAnalytics(projectId);
      return response.analytics;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch analytics');
    }
  }
);

const initialState = {
  analytics: null,
  isLoading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.analytics = null;
      state.error = null;
    },
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalytics, clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
