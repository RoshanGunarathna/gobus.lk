import axiosInstance from './axiosInstance';

// Fetch all schedule

export const getAllSchedule = async () => {
    try {
      const response = await axiosInstance.get(`scheduleManagement/getAllSchedules`);
      console.log("response",response);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "An error." };
    }
  };
