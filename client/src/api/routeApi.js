import axiosInstance from './axiosInstance';

// Add new route
export const addRoute = async (routeData) => {
  try {
    const response = await axiosInstance.post('routeManagement/addRoute', routeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllRoutes = async () => {
  try {
    const response = await axiosInstance.get('routeManagement/getAllRoutes');
 
    return response;  // Return the full response to handle data extraction in the component
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Get route by ID
export const getRouteById = async (id) => {
  try {
    const response = await axiosInstance.get(`routeManagement/getRoute?id=${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching route by ID:', error);
    throw error;
  }
};


// Update route
export const updateRoute = async (routeData) => {
  try {
   

    const response = await axiosInstance.post('routeManagement/updateRoute', {
      id: routeData._id,
      routeId: routeData.routeId,
      name: routeData.name
    });

   
    return response;
  } catch (error) {
    console.error('API error details:', error.response?.data);
    throw error;
  }
};


// Delete route
export const deleteRoute = async (id) => {
  try {
    const response = await axiosInstance.post('routeManagement/deleteRoute', { id });
    return response.data;
  } catch (error) {
    throw error;
  }
};