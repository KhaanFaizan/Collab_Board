import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminService.getUsers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch users');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateUserRole(userId, role);
      return { userId, role, user: response.user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update user role');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await adminService.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete user');
    }
  }
);

export const fetchAdminDashboard = createAsyncThunk(
  'admin/fetchAdminDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getAdminDashboard();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch admin dashboard');
    }
  }
);

// Admin Projects
export const fetchAdminProjects = createAsyncThunk(
  'admin/fetchAdminProjects',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminService.getAdminProjects(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch admin projects');
    }
  }
);

export const updateAdminProject = createAsyncThunk(
  'admin/updateAdminProject',
  async ({ projectId, updates }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateAdminProject(projectId, updates);
      return response.project;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update project');
    }
  }
);

export const deleteAdminProject = createAsyncThunk(
  'admin/deleteAdminProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await adminService.deleteAdminProject(projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete project');
    }
  }
);

// Admin Tasks
export const fetchAdminTasks = createAsyncThunk(
  'admin/fetchAdminTasks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminService.getAdminTasks(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch admin tasks');
    }
  }
);

export const updateAdminTask = createAsyncThunk(
  'admin/updateAdminTask',
  async ({ taskId, updates }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateAdminTask(taskId, updates);
      return response.task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update task');
    }
  }
);

export const deleteAdminTask = createAsyncThunk(
  'admin/deleteAdminTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await adminService.deleteAdminTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete task');
    }
  }
);

const initialState = {
  users: [],
  projects: [],
  tasks: [],
  dashboard: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0
  },
  projectsPagination: {
    current: 1,
    pages: 1,
    total: 0
  },
  tasksPagination: {
    current: 1,
    pages: 1,
    total: 0
  },
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearAdminData: (state) => {
      state.users = [];
      state.dashboard = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update user role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload.userId);
        if (index !== -1) {
          state.users[index].role = action.payload.role;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch admin dashboard
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboard = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch admin projects
      .addCase(fetchAdminProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.projects;
        state.projectsPagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchAdminProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update admin project
      .addCase(updateAdminProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(project => project._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateAdminProject.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete admin project
      .addCase(deleteAdminProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(project => project._id !== action.payload);
        state.projectsPagination.total -= 1;
      })
      .addCase(deleteAdminProject.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch admin tasks
      .addCase(fetchAdminTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.tasks;
        state.tasksPagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchAdminTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update admin task
      .addCase(updateAdminTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateAdminTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete admin task
      .addCase(deleteAdminTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
        state.tasksPagination.total -= 1;
      })
      .addCase(deleteAdminTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearAdminError, clearAdminData } = adminSlice.actions;
export default adminSlice.reducer;
