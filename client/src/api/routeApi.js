// routeApi.js
import axiosInstance from './axiosInstance';

export const addRoute = async (routeData) => {
  try {
    const response = await axiosInstance.post('/routeManagement/addRoute', routeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred.' };
  }
};

export const getRoutes = async () => {
  try {
    const response = await axiosInstance.get('/routeManagement/getAllRoutes');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred.' };
  }
};

export const getRouteById = async (id) => {
  try {
    const response = await axiosInstance.get(`/routeManagement/getRoute?id=${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred.' };
  }
};



// routeApi.js - Update these functions to match your backend routes
export const updateRoute = async (routeData) => {
    try {
      const response = await axiosInstance.post('/routeManagement/updateRoute', routeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred.' };
    }
  };
  
  export const deleteRoute = async (id) => {
    try {
      const response = await axiosInstance.post('/routeManagement/deleteRoute', {
        data: { id }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred.' };
    }
  };