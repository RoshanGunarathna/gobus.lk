    import axiosInstance from './axiosInstance';


    // Fetch all schedule
    export const getAllSchedule = async () => {
        try {
          const response = await axiosInstance.get(`scheduleManagement/getAllSchedules`);
          console.log("response",response);
          return response.data;
        } catch (error) {
          throw error.response?.data || { message: "An error." };
        }
      };


      // get a schedule
      export const getASchedule = async (sid) => {
        try {
          const response = await axiosInstance.get('scheduleManagement/getSchedule', {
            params: { id: sid }
          });
          return response.data;
        } catch (error) {
          console.error('Error fetching schedule:', error); 
          throw error.response?.data || { message: "Failed to fetch schedule" };
        }
      };
      

      // Update a schedule
      export const updateSchedule = async (scheduleData) => {
        try {
          const response = await axiosInstance.post('scheduleManagement/updateSchedule', {id: scheduleData._id,  scheduleId: scheduleData.scheduleId, 
            seatPrice: scheduleData.seatPrice, startTime: scheduleData.startTime, endTime: scheduleData.endTime , 
            routeId: scheduleData.routeId, busId: scheduleData.busId});
          return response.data;
        } catch (error) {
          throw error.response?.data || { message: 'An error occurred.' };
        }
      };


      // Delete a shedule
      export const deleteShedule = async (id) => {
        try {
          const response = await axiosInstance.post('scheduleManagement/deleteSchedule', { id });
          return response.data; 
        } catch (error) {
          throw error.response?.data || { message: 'Schedule ekak delete karana kalin de kenek asarana wuna.' };
        }
      };


      // Add a new Shedule
      export const addSchedule = async (scheduleData) => {
          try {
            const response = await axiosInstance.post('scheduleManagement/addSchedule', scheduleData);
            return response.data;
          } catch (error) {
            throw error.response?.data || { message: 'An error occurred.' };
          }
        };