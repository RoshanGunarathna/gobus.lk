import axiosInstance from './axiosInstance';

export const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(`dashboard/getDashboardData`);
      return response.data.dashboardData;
    } catch (error) {
      throw error.response?.data || { message: "An error." };
    }
  };


 