import axiosInstance from './axiosInstance';


export const getUserBookings = async (userId) => {
    try {
      const response = await axiosInstance.get(`booking/getBookings`); 
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch user bookings." };
    }
};

 // Add a new booking
 export const addUserBookings = async (bookingData) => {
    try {
      const response = await axiosInstance.post('booking/addBooking', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred.' };
    }
  };

   // Delete a shedule
   export const commuterdeletebooking = async (id) => {
    try {
      const response = await axiosInstance.post('booking/cancelBooking', { id });
      return response.data; 
    } catch (error) {
      throw error.response?.data || { message: 'faild delete' };
    }
  };
