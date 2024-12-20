import axios from 'axios';




const axiosInstance = axios.create({

    //baseURL: 'http://localhost:5000/api', // API Base URL
    baseURL: 'http://192.168.43.126:5000/api', // API Base URL
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
    
      refreshAccessToken();
      

            // Redirect to login or show error

    }
    return Promise.reject(error);
  }
);

export default axiosInstance;