import axiosInstance from './axiosInstance';



export const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(`userManagement/getAllUsers`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "An error." };
    }
  };


  
export const getAUser = async (uid) => {
  try {
  
    const response = await axiosInstance.get(`userManagement/getUser`, {
      params: { uid }, // Pass uid as a query parameter
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error." };
  }
};

export const updateUser = async (uid) => {
  try {
    
    const response = await axiosInstance.post(`userManagement/updateUser`, {uid});
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error." };
  }
};

  