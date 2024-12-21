const { getBusById, updateBusById , getBuses, deleteBusById, addABus} = require('../services/busManagementService');
const { handleResponse } = require('../utils/responseHandler');


const addBus = async (req, res, next) => {
  
  try {
 
   const {number, name, seat} = req.body;
    const data = await addABus(number, name, seat);

    handleResponse(res, data.statusCode, 'Bus added successfully', null);
  } catch (err) {
    next(err);
  }
};



const getBus = async (req, res, next) => {
  
  try {
    const { id } = req.query;
    const bus = await getBusById({id, user:req.user});

    handleResponse(res, 200, 'Bus retrieved successfully', {bus: bus});
  } catch (err) {
    next(err);
  }
};

const updateBus = async (req, res, next) => {

  try {

    const bus = await updateBusById({user:req.user, body: req.body});
    handleResponse(res, 200, 'Bus Update successfully', {bus:bus});
  } catch (err) {
    next(err);
  }
};

const getAllBuses = async (req, res, next) => {
  
  try {
    const Buses = await getBuses({user: req.user});
    handleResponse(res, 200, 'Buses are retrieved successfully', {Buses: Buses});
  } catch (err) {
    next(err);
  }
};

const deleteBus = async (req, res, next) => {

  try {
    const {id} = req.body;

    await deleteBusById(id);

    handleResponse(res, 200, 'Bus Delete successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBus,
  updateBus,
  getAllBuses,
  deleteBus,
  addBus
};
