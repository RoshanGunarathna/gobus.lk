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


export const updateUser = async (uid, userData) => {
  try {
    const response = await axiosInstance.post(`userManagement/updateUser`, {
      uid,
      ...userData
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred while updating user." };
  }
};
  

export const deleteUser = async (uid) => {
  try {
    const response = await axiosInstance.post(`userManagement/deleteUser`, { uid });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred while deleting user." };
  }
};