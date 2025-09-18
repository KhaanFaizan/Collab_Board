import api from './api';

const getUsers = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await api.get(`/admin/users?${queryParams}`);
  return response.data;
};

const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}`, { role });
  return response.data;
};

const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

const getAdminProjects = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await api.get(`/admin/projects?${queryParams}`);
  return response.data;
};

const getAdminTasks = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await api.get(`/admin/tasks?${queryParams}`);
  return response.data;
};

const updateAdminProject = async (projectId, updates) => {
  const response = await api.put(`/admin/projects/${projectId}`, updates);
  return response.data;
};

const updateAdminTask = async (taskId, updates) => {
  const response = await api.put(`/admin/tasks/${taskId}`, updates);
  return response.data;
};

const deleteAdminProject = async (projectId) => {
  const response = await api.delete(`/admin/projects/${projectId}`);
  return response.data;
};

const deleteAdminTask = async (taskId) => {
  const response = await api.delete(`/admin/tasks/${taskId}`);
  return response.data;
};

const adminService = {
  getUsers,
  updateUserRole,
  deleteUser,
  getAdminDashboard,
  getAdminProjects,
  getAdminTasks,
  updateAdminProject,
  updateAdminTask,
  deleteAdminProject,
  deleteAdminTask,
};

export default adminService;
