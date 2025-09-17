import api from './api';

const getProjectAnalytics = async (projectId) => {
  const response = await api.get(`/analytics/${projectId}`);
  return response.data;
};

const analyticsService = {
  getProjectAnalytics,
};

export default analyticsService;
