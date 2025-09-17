import api from './api';

const getCalendarData = async (userId) => {
  const response = await api.get(`/calendar/${userId}`);
  return response.data;
};

const calendarService = {
  getCalendarData,
};

export default calendarService;
