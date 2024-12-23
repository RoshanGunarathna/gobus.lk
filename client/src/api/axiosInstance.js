import axios from 'axios';



const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // API Base URL
    withXSRFToken: true,
    withCredentials: true, // Send cookies with requests if required
    headers: {
        'Content-Type': 'application/json', // Default header for JSON requests
    },
});

// Request interceptor
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
  
// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401 && error.response?.data?.message === 'Access token expired') {
      try {
        const res = await axiosInstance.post(`auth/refreshToken`);
        localStorage.setItem('accessToken', res.accessToken);

        console.log(`Accessss Tokee`, res)
       
        error.config.headers.Authorization = `Bearer ${res.accessToken}`;

        return axiosInstance.request(error.config); 
      } catch (refreshError) {
       
        console.log("refreshError");
         localStorage.removeItem('accessToken');
        
        //  window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    if (error.response?.status === 401 && (error.response?.data?.message === 'Invalid token' || error.response?.data?.message === "Authentication required token null")){
      localStorage.removeItem('accessToken');
     
      return Promise.reject(error);
    }
   
    return Promise.reject(error);
  }
);

 //error.config.headers.Authorization = res.accessToken;


export default axiosInstance;