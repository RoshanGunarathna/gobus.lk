const { getRouteById, updateRouteById , getRoutes, deleteRouteById, addARoute} = require('../services/routeManagementService');
const { handleResponse } = require('../utils/responseHandler');


const addRoute = async (req, res, next) => {
  
  try {
 
   const {routeId, name} = req.body;
    const data = await addARoute(routeId, name);

    handleResponse(res, data.statusCode, 'Route added successfully', null);
  } catch (err) {
    next(err);
  }
};



const getRoute = async (req, res, next) => {
  
  try {
    const {id} = req.body;
    const route = await getRouteById({id, user:req.user});

    handleResponse(res, 200, 'Route retrieved successfully', {route: route});
  } catch (err) {
    next(err);
  }
};

const updateRoute = async (req, res, next) => {

  try {

    const route = await updateRouteById({user:req.user, body: req.body});
    handleResponse(res, 200, 'Route Update successfully', {route:route});
  } catch (err) {
    next(err);
  }
};

const getAllRoutes = async (req, res, next) => {
  
  try {
    const routes = await getRoutes({user: req.user});
    handleResponse(res, 200, 'Routes are retrieved successfully', {routes: routes});
  } catch (err) {
    next(err);
  }
};

const deleteRoute = async (req, res, next) => {

  try {
    const {id} = req.body;

    await deleteRouteById(id);

    handleResponse(res, 200, 'Route Delete successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRoute,
  updateRoute,
  getAllRoutes,
  deleteRoute,
  addRoute
};
