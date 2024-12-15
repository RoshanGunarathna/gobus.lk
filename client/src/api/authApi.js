import axios from 'axios';
import { getAccessToken, setAccessToken, removeAccessToken } from '../utils/tokenUtils';

// const API_URL = process.env.API_URL;
const API_URL = "http://localhost:5000/api";

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
    setAccessToken(response.data.accessToken); // Save access token
    return response.data.user; // Return user data
};

export const logout = async () => {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    removeAccessToken(); // Clear token on logout
};

export const refreshAccessToken = async () => {
    const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });
    setAccessToken(response.data.accessToken); // Save new access token
    return response.data.accessToken;
};
