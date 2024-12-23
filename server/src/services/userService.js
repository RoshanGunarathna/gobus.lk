const { User } = require('../models');
const CustomError = require('../utils/customError');

const getUserById = async (uid) => {

  const user = await User.findById(uid);
  if (!user) {
    throw new CustomError("User not found", 404);
  }
 
  return user;
};



const updateUserById = async (data) => {
  try {
    const user = await User.findById(data.user.uid).select('-__v -password');
    
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const updatedUser = await User.findByIdAndUpdate(data.user.uid, data.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on the update
    }).select('-__v -password');
   
    return updatedUser;
  } catch (error) {
  
    throw error;
  }
};


const deleteUserById = async (uid)=> {
  
  const user = await User.findByIdAndDelete(uid);
   if (!user) {
    throw new CustomError("User not found", 404);
  }
return null;
}

module.exports = {
  getUserById,
  updateUserById,
  deleteUserById
};
