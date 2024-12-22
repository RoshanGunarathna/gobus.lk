
const { Bus } = require('../models');
const CustomError = require('../utils/customError');


const isBusExist = async (number) => {
  return await Bus.findOne({ number }).select('-__v');
};

const addABus = async (number, name, seat) => {
  try {

    const existingBus = await isBusExist(number);
    if (existingBus) {
      throw new CustomError("Bus already exists", 400);
  
    }
  

  await Bus.create({number,name,seat});
    
    return {statusCode: 201};
  } catch (error) {
    throw error;
  }
};


const getBusById = async (data) => {
  try {
    const bus = await Bus.findById(data.id).select('-__v');
    
    if (!bus) {
      throw new CustomError("Bus not found", 404);
    }

    return bus;
  } catch (error) {
    throw error;
  }
};




const updateBusById = async (data) => {
  try {
  
    const updatedBus = await Bus.findByIdAndUpdate(data.body.id, data.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on the update
    }).select('-__v');

    if (!updatedBus) {
      throw new CustomError("Bus not found", 404);
    }
   
    return updatedBus;
  } catch (error) {
  
    throw error;
  }
};


const deleteBusById = async (id) => {
  try {
    const existingBus = await Bus.findById(id);
    if (!existingBus) {
      throw new CustomError("Bus not found", 404);
    }

     await Bus.findByIdAndDelete(id).select('-__v');
   
    return null;
  } catch (error) {
   
    throw error;
  }
};


const getBuses = async () => {
  try {
    const busList =  await Bus.find({}).select('-__v');
    return busList;
  } catch (error) {
   
    throw error;
  }
};


module.exports = {
  getBusById,
  updateBusById,
  deleteBusById,
  getBuses,
  addABus
};

