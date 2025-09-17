import api from './api';

const uploadFile = async (projectId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('projectId', projectId);

  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const getProjectFiles = async (projectId) => {
  const response = await api.get(`/files/${projectId}`);
  return response.data;
};

const deleteFile = async (fileId) => {
  const response = await api.delete(`/files/${fileId}`);
  return response.data;
};

const fileService = {
  uploadFile,
  getProjectFiles,
  deleteFile,
};

export default fileService;
