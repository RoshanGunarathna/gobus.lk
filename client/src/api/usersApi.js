import axiosInstance from './axiosInstance';



export const getUserData = async () => {
    try {
      const response = await axiosInstance.get(`/users/getAll`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "An error." };
    }
  };