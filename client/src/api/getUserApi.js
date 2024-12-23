import axiosInstance from './axiosInstance';

export const fetchUserApi = async () => {
  try {
    const response = await axiosInstance.get('user/getUser'); 
    console.log("Logged-in User Data:", response.data); 
    return response.data; 
  } catch (error) {
    console.error("Error Fetching User Data:", error.response?.data?.message || 'An error occurred.');
    throw error.response?.data?.message || 'An error occurred.'; 
  }
};