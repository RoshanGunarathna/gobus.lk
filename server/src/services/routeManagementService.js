
const { Route } = require('../models');
const CustomError = require('../utils/customError');


const isRouteExist = async (routeId) => {
  return await Route.findOne({ routeId }).select('-__v');
};

const addARoute = async (routeId, name) => {
  try {


    const existingRoute = await isRouteExist(routeId);
    if (existingRoute) {
      throw new CustomError("Route already exists", 400);
  
    }
  

  await Route.create({routeId,name});
    
    return {statusCode: 201};
  } catch (error) {
    throw error;
  }
};


const getRouteById = async (data) => {
  try {
    const route = await Route.findById(data.id).select('-__v');
    
    if (!route) {
      throw new CustomError("Route not found", 404);
    }

    return route;
  } catch (error) {
    throw error;
  }
};


const updateRouteById = async (data) => {
  try {
  
    const updatedRoute = await Route.findByIdAndUpdate(data.body.id, data.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on the update
    }).select('-__v');

    if (!updatedRoute) {
      throw new CustomError("Route not found", 404);
    }
   
    return updatedRoute;
  } catch (error) {
  
    throw error;
  }
};


const deleteRouteById = async (id) => {
  try {
    const existingRoute = await Route.findById(id);
    if (!existingRoute) {
      throw new CustomError("Route not found", 404);
    }

     await Route.findByIdAndDelete(id).select('-__v');
   
    return null;
  } catch (error) {
   
    throw error;
  }
};


const getRoutes = async () => {
  try {
    const routeList =  await Route.find({}).select('-__v');
    return routeList;
  } catch (error) {
   
    throw error;
  }
};


module.exports = {
  getRouteById,
  updateRouteById,
  deleteRouteById,
  getRoutes,
  addARoute
};

