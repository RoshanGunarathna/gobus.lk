const { getScheduleById, updateScheduleById , getSchedules, deleteScheduleById, addASchedule} = require('../services/scheduleManagementService');
const { handleResponse } = require('../utils/responseHandler');


const addSchedule = async (req, res, next) => {
  
  try {
 
 
    const data = await addASchedule(req.body);

    handleResponse(res, data.statusCode, 'Schedule added successfully', null);
  } catch (err) {
    next(err);
  }
};



const getSchedule = async (req, res, next) => {
  
  try {
    const { id } = req.query;
    const schedule = await getScheduleById({id, user:req.user});

    handleResponse(res, 200, 'Schedule retrieved successfully', {schedule: schedule});
  } catch (err) {
    next(err);
  }
};

const updateSchedule = async (req, res, next) => {

  try {

    const schedule = await updateScheduleById({user:req.user, body: req.body});
    handleResponse(res, 200, 'Schedule Update successfully', {schedule:schedule});
  } catch (err) {
    next(err);
  }
};

const getAllSchedules = async (req, res, next) => {
  
  try {
    const schedules = await getSchedules({user: req.user});
    handleResponse(res, 200, 'Schedules are retrieved successfully', {schedules: schedules});
  } catch (err) {
    next(err);
  }
};

const deleteSchedule = async (req, res, next) => {

  try {
    const {id} = req.body;

    await deleteScheduleById(id);

    handleResponse(res, 200, 'Schedule Delete successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSchedule,
  updateSchedule,
  getAllSchedules,
  deleteSchedule,
  addSchedule
};
