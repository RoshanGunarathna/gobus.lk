import axios from 'axios';




const axiosInstance = axios.create({

    baseURL: 'http://localhost:5000/api', // API Base URL
   
    withCredentials: true, // Send cookies with requests if required
    headers: {
        'Content-Type': 'application/json', // Default header for JSON requests
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
  
// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle common errors
    if (error.response?.status === 403) {
      // Handle unauthorized access
      localStorage.removeItem('token');
    
      const token = refreshAccessToken();
      if(token){
        //Previous route
      }
      

        

    }
    return Promise.reject(error);
  }
);


const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post(`auth/refreshToken`);
    localStorage.setItem('token', response.data.accessToken)
    return response.data.accessToken;
  } catch (error) {
    throw error.response?.data || { message: "An error." };
  }
};

export default axiosInstance;