const { getSheduleById, updateSheduleById , getShedules, deleteSheduleById, addAShedule} = require('../services/sheduleManagementService');
const { handleResponse } = require('../utils/responseHandler');


const addShedule = async (req, res, next) => {
  
  try {
 
   const {sheduleId, name} = req.body;
    const data = await addAShedule(sheduleId, name);

    handleResponse(res, data.statusCode, 'Shedule added successfully', null);
  } catch (err) {
    next(err);
  }
};



const getShedule = async (req, res, next) => {
  
  try {
    const { id } = req.query;
    const shedule = await getSheduleById({id, user:req.user});

    handleResponse(res, 200, 'Shedule retrieved successfully', {shedule: shedule});
  } catch (err) {
    next(err);
  }
};

const updateShedule = async (req, res, next) => {

  try {

    const shedule = await updateSheduleById({user:req.user, body: req.body});
    handleResponse(res, 200, 'Shedule Update successfully', {shedule:shedule});
  } catch (err) {
    next(err);
  }
};

const getAllShedules = async (req, res, next) => {
  
  try {
    const shedules = await getShedules({user: req.user});
    handleResponse(res, 200, 'Shedules are retrieved successfully', {shedules: shedules});
  } catch (err) {
    next(err);
  }
};

const deleteShedule = async (req, res, next) => {

  try {
    const {id} = req.body;

    await deleteSheduleById(id);

    handleResponse(res, 200, 'Shedule Delete successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getShedule,
  updateShedule,
  getAllShedules,
  deleteShedule,
  addShedule
};
