import axiosInstance from './axiosInstance';




export const register = async (name, email, password) => {
  
  try {
    // POST request to the /signup endpoint
    const response = await axiosInstance.post(`auth/register`, { name, email, password });
    return response.data; // Return the server's response
  } catch (error) {
    // Log and handle registration errors
    console.error("Error during registration:", error.response?.data || error.message);
    throw error.response?.data || { message: "An error occurred during registration." };
  }
};


export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('auth/login', { email, password });
    localStorage.setItem('token', response.data.accessToken);
    return response.data; // Return the server's response
  } catch (error) {
    console.error('Error during login:', error.response?.data || error.message);
    throw error.response?.data || { message: 'An error occurred during login.' };
  }
};


export const logout = async () => {
    await axiosInstance.post(`auth/logout`);
    localStorage.removeItem('token');
};



