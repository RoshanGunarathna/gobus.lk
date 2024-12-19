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


// API call to login user
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(`auth/login`, { email, password });
    localStorage.setItem("Token", response.data.accessToken);
    return response.data; // Return the server's response
  } catch (error) {
    // Log and handle login errors
    console.error("Error during login:", error.response?.data || error.message);
    throw error.response?.data || { message: "An error occurred during login." };
  }
};





export const refreshAccessToken = async () => {
  const response = await axios.post(`auth/refreshToken`, {}, { withCredentials: true });
  // setAccessToken(response.data.accessToken); // Save new access token
 localStorage.setItem('token', response.data.accessToken)
   return response.data.accessToken;
};

export const logout = async () => {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    removeAccessToken(); // Clear token on logout
};

// // API call to register user 
// export const register = async (name, email, password) => {
//   try {
//     // POST request to the /signup endpoint
//     const response = await axios.post(`${API_URL}/register`, { name, email, password });
//     return response.data; // Return the server's response
//   } catch (error) {
//     // Log and handle registration errors
//     console.error("Error during registration:", error.response?.data || error.message);
//     throw error.response?.data || { message: "An error occurred during registration." };
//   }
// };


// // API call to login user
// export const login = async (email, password) => {
//   try {
//     const response = await axios.post(`${API_URL}/login`, { email, password });
//     return response.data; // Return the server's response
//   } catch (error) {
//     // Log and handle login errors
//     console.error("Error during login:", error.response?.data || error.message);
//     throw error.response?.data || { message: "An error occurred during login." };
//   }
// };

