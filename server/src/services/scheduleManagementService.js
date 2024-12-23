
const { Schedule } = require('../models');
const CustomError = require('../utils/customError');
const { getRouteById } = require('./routeManagementService');
const { getBusById } = require('./busManagementService');
const { ValidatorsImpl } = require('express-validator/lib/chain');



const isScheduleExist = async (scheduleId) => {
  return await Schedule.findOne({ scheduleId }).select('-__v');
};

const addASchedule = async (data) => {
  try {

    const existingSchedule = await isScheduleExist(data.id);
    if (existingSchedule) {
      throw new CustomError("Schedule already exists", 400);
    }
  

  await Schedule.create({scheduleId: data.scheduleId, seatPrice: data.seatPrice, startTime: new Date(data.startTime),
    endTime: new Date(data.endTime), routeId: data.routeId, busId: data.busId});
    
    return {statusCode: 201};
  } catch (error) {
    throw error;
  }
};


const getScheduleById = async (data) => {
  try {
    var schedule = await Schedule.findById(data.id).select('-__v');

     
    if (!schedule) {
      throw new CustomError("Schedule not found", 404);
    }

    const routeData = await getRouteById({id: schedule.routeId});
    const busData = await getBusById({id: schedule.busId});

    schedule = {
      _id: schedule._id,
      scheduleId: schedule.scheduleId,
      seatPrice: schedule.seatPrice,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      route: routeData,
      bus: busData,
    }; 


   

    return schedule;
  } catch (error) {
    throw error;
  }
};




const updateScheduleById = async (data) => {
  try {
  
    const updatedSchedule = await Schedule.findByIdAndUpdate(data.body.id, data.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on the update
    }).select('-__v');

    if (!updatedSchedule) {
      throw new CustomError("Schedule not found", 404);
    }
   
    return updatedSchedule;
  } catch (error) {
  
    throw error;
  }
};


const deleteScheduleById = async (id) => {
  try {
    const existingSchedule = await Schedule.findById(id);
    if (!existingSchedule) {
      throw new CustomError("Schedule not found", 404);
    }

     await Schedule.findByIdAndDelete(id).select('-__v');
   
    return null;
  } catch (error) {
   
    throw error;
  }
};


const getSchedules = async () => {
  try {
    const  res =  await Schedule.find({}).select('-__v');
    var scheduleList = [];

        if (res && res.length > 0) {
            await Promise.all(
              res.map(async (schedule) => {

                const routeData = await getRouteById({id: schedule.routeId});
                const busData = await getBusById({id: schedule.busId});
                       
                scheduleList.push({
                  _id: schedule._id,
                  scheduleId: schedule.scheduleId,
                  seatPrice: schedule.seatPrice,
                  startTime: schedule.startTime,
                  endTime: schedule.endTime,
                  route: routeData,
                  bus: busData,
                });   
    
                })
            );
        }

   

    return scheduleList;
  } catch (error) {
   
    throw error;
  }
};


module.exports = {
  getScheduleById,
  updateScheduleById,
  deleteScheduleById,
  getSchedules,
  addASchedule
};

