import axiosInstance from './axiosInstance';

export const getUserData = async () => {
    const response = await axiosInstance.get(`/users/getAll`);
    return response.data.users; // Return user data
};