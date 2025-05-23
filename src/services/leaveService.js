// filepath: frontend/src/services/leaveService.js
import api from './api';

export const submitLeaveRequest = async (leaveData) => {
  const response = await api.post('/leave/submit', leaveData);
  return response.data;
};

export const getLeaveRequests = async () => {
  const response = await api.get('/leave');
  return response.data;
};

export const updateLeaveStatus = async (id, status) => {
  const response = await api.put(`/leave/${id}`, { status });
  return response.data;
};