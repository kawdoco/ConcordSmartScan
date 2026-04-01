import apiClient from './api';

/**
 * Get all locations (stores + garments)
 */
export const getAllLocations = () => apiClient.get('/locations');

/**
 * Get a single location by ID
 */
export const getLocationById = (id) => apiClient.get(`/locations/${id}`);

/**
 * Get a single store by ID
 */
export const getStoreById = (id) => 
  getLocationById(id).then(res => res.data);

/**
 * Create a new location (type: "STORE" or "GARMENT")
 */
export const createLocation = (data) => apiClient.post('/locations', data);

/**
 * Update an existing location
 */
export const updateLocation = (id, data) => apiClient.put(`/locations/${id}`, data);

/**
 * Delete a location
 */
export const deleteLocation = (id) => apiClient.delete(`/locations/${id}`);

/**
 * Get all garment locations
 */
export const getAllGarments = () => apiClient.get('/locations/garments');

/**
 * Get a single garment by ID
 */
export const getGarmentById = (id) => 
  getLocationById(id).then(res => res.data);

/**
 * Create a new garment location
 */
export const createGarment = (data) => {
  const payload = {
    ...data,
    type: 'GARMENT',
  };
  return createLocation(payload);
};

/**
 * Update an existing garment location
 */
export const updateGarment = (id, data) => {
  const payload = {
    ...data,
    type: 'GARMENT',
  };
  return updateLocation(id, payload);
};

/**
 * Get all store locations (filtered from all locations)
 */
export const getAllStores = () =>
  getAllLocations().then(res =>
    res.data.filter(loc => loc.type === 'STORE')
  );

/**
 * Create a new store location
 */
export const createStore = (data) => {
  const payload = {
    ...data,
    type: 'STORE',
  };
  return createLocation(payload);
};

/**
 * Update an existing store location
 */
export const updateStore = (id, data) => {
  const payload = {
    ...data,
    type: 'STORE',
  };
  return updateLocation(id, payload);
};
