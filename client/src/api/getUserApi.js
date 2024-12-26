// api/userApi.js
import axiosInstance from './axiosInstance';

export const fetchUserApi = async () => {
  try {
    const response = await axiosInstance.get('user/getUser');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch user data';
  }
};

export const updateUserApi = async (userData) => {
  try {
    const response = await axiosInstance.post('user/updateUser', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update user';
  }
};

export const deleteUserApi = async () => {
  try {
    const response = await axiosInstance.post('user/deleteUser');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete user';
  }
};