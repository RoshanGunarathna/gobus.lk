import axiosInstance from './axiosInstance';

// Fetch all buses
export const getAllBuses = async () => {
  try {
    const response = await axiosInstance.get('/busManagement/getAllBuses');
    return response.data.Buses; // Return the bus list
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred.' };
  }
};

// Fetch a single bus
export const getBusById = async (id) => {
  try {
    const response = await axiosInstance.get('/busManagement/getBus', { params: { id } });
    return response.data.bus; 
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred.' };
  }
};

// Add a new bus
export const addBus = async (busData) => {
  try {
    const response = await axiosInstance.post('/busManagement/addBus', busData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred.' };
  }
};

// Update a bus
export const updateBus = async (busData) => {
  try {
    
    const response = await axiosInstance.post('/busManagement/updateBus',
    {id: busData._id, number: busData.number, name: busData.name, seat: busData.seat});
    console.log(response.data); // Debugging line, check what data is returned
    return response.data;

  } catch (error) {
    throw error.response?.data || { message: 'An error occurred.' };
  }
};



// Delete a bus
export const deleteBus = async (id) => {
  try {
    const response = await axiosInstance.post('/busManagement/deleteBus', { id });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred.' };
  }
};
