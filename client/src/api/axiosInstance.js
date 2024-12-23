import axios from 'axios';



const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // API Base URL
    withCredentials: true, // Send cookies with requests if required
    headers: {
        'Content-Type': 'application/json', // Default header for JSON requests
    },
});


axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  response => response.data,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry && error.response?.data?.message === 'Access token expired') {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
      try {
        const res = await axiosInstance.post(`auth/refreshToken`);
        localStorage.setItem('accessToken', res.accessToken);

    
        // Update the authorization header with the new access token.
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.accessToken}`;
        return axiosInstance(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;