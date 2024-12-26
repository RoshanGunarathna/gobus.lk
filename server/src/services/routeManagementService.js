
const { Route } = require('../models');
const CustomError = require('../utils/customError');
const { generateSmallId } = require('../utils/smallIdGenerator');


const isRouteExist = async (routeId) => {
  return await Route.findOne({ routeId }).select('-__v');
};

const addARoute = async (name) => {
  try {



    const routeId = await generateUniqueRouteId();

  

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

    const routeData = {
      id: data.body.id,
      name: data.body.name
    }
  
    const updatedRoute = await Route.findByIdAndUpdate(data.body.id, routeData, {
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


 const generateUniqueRouteId = async () => {
  let routeId;
  let isUnique = false;

  while (!isUnique) {
    routeId = generateSmallId("RT"); 
    const existingBooking = await isRouteExist(routeId); 

    if (!existingBooking) {
      isUnique = true; 
    }
  }

  return routeId;
};

module.exports = {
  getRouteById,
  updateRouteById,
  deleteRouteById,
  getRoutes,
  addARoute
};

