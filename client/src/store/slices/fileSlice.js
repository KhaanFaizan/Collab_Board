import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fileService from '../../services/fileService';

// Async thunks
export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async ({ projectId, file }, { rejectWithValue }) => {
    try {
      const response = await fileService.uploadFile(projectId, file);
      return response.file;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to upload file');
    }
  }
);

export const getProjectFiles = createAsyncThunk(
  'files/getProjectFiles',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await fileService.getProjectFiles(projectId);
      return response.files;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch files');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async (fileId, { rejectWithValue }) => {
    try {
      await fileService.deleteFile(fileId);
      return fileId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete file');
    }
  }
);

const initialState = {
  files: [],
  isLoading: false,
  error: null,
};

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files.unshift(action.payload);
        state.error = null;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get project files
      .addCase(getProjectFiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProjectFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = action.payload;
        state.error = null;
      })
      .addCase(getProjectFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete file
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(file => file._id !== action.payload);
      });
  },
});

export const { clearError } = fileSlice.actions;
export default fileSlice.reducer;
