import axiosInstance from './axiosInstance';

// Fetch all schedule

export const getAllBooking = async () => {
    try {
      const response = await axiosInstance.get(`bookingManagement/getAllBookings`);
      console.log("response",response);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "An error." };
    }
  };

  export const getCommuter = async () => {
    try {
      const response = await axiosInstance.get(`bookingManagement/getAllCommuters`);  
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch  commuter" };
    }
};

 // Add a new booking
 export const addOperatorBookings = async (bookingData) => {
  try {
    const response = await axiosInstance.post('bookingManagement/addBooking', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred.' };
  }
};

   // Delete a boooking
   export const operatordeletebooing = async (id) => {
    try {
      const response = await axiosInstance.post('/bookingManagement/deleteBooking', { id });
      return response.data; 
    } catch (error) {
      throw error.response?.data || { message: 'faild to delete' };
    }
  };

  // get a schedule
  export const getABooking= async (sid) => {
    try {
      const response = await axiosInstance.get('bookingManagement/getBooking', {
        params: { id: sid }
      });
      console.log('get a response:', response);

      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error); 
      throw error.response?.data || { message: "Failed to fetch booking" };
    }
  };


  export const updateBookingAPI = async (booking) => {
    try {
      if (!booking.id || !booking.scheduleId) {
        throw new Error('Required IDs are missing');
      }
  
      const response = await axiosInstance.post('bookingManagement/updateBooking', {
        id: booking.id,
        scheduleId: booking.scheduleId,
        commuterId: booking.commuterId,
        seats: booking.seats,
        paySlipNumber: booking.paySlipNumber
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred.' };
    }
  };