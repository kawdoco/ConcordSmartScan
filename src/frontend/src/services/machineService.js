import apiClient from './api';

export const getAllMachines = (search) => {
  const params = search ? { search } : undefined;
  return apiClient.get('/machines', { params });
};

export const getMachineByCode = (machineCode) =>
  apiClient.get(`/machines/code/${encodeURIComponent(machineCode)}`);

export const createMachine = (data) => apiClient.post('/machines', data);
