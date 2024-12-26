import axiosInstance from './axiosInstance';

export const getAdminDashboardData = async () => {
    try {
      const response = await axiosInstance.get(`dashboard/getDashboardDataForAdmin`);
      return response.data.dashboardData;
    } catch (error) {
      throw error.response?.data || { message: "An error." };
    }
  };

  export const getOperatorDashboardData = async () => {
    try {
      const response = await axiosInstance.get(`dashboard/getDashboardDataForOperator`);
      return response.data.dashboardData;
    } catch (error) {
      throw error.response?.data || { message: "An error." };
    }
  };

