
const { User } = require('../models');
const CustomError = require('../utils/customError');

const getUserById = async (data) => {
  try {

    
console.log(data.uid);

    const user = await User.findById(data.uid).select('-__v -password');


    
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const isUserCanAccess = isUserHaveAccess(data, user);

    if(!isUserCanAccess){
      throw new CustomError("You can't access this user data", 401);
    }

    return user;
  } catch (error) {
    throw error;
  }
};




const updateUserById = async (data) => {
  try {
    const user = await User.findById(data.body.uid).select('-__v -password');
    
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const isUserCanAccess = isUserHaveAccess(data, user);

    if(!isUserCanAccess){
      throw new CustomError("You can't access this user data", 401);
    }

    const updatedUser = await User.findByIdAndUpdate(data.body.uid, data.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on the update
    }).select('-__v -password');
   
    return updatedUser;
  } catch (error) {
  
    throw error;
  }
};


const deleteUserById = async (data) => {
  try {
    const user = await User.findById(data.uid).select('-__v -password');
    
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const isUserCanAccess = isUserHaveAccess(data, user);

    if(!isUserCanAccess){
      throw new CustomError("You can't access this user data", 401);
    }

    await User.findByIdAndDelete(data.uid).select('-__v -password');
    return null;
  } catch (error) {
   
    throw error;
  }
};


const getUsers = async (data) => {
  try {
    const userList = await getUsersWithFilter(data.user.role);
    return userList;
  } catch (error) {
   
    throw error;
  }
};

const getUsersWithFilter = async(userRole) => {
  try {
    var userList = [];
    if (userRole === 'operator') {
      userList = await User.find({ role: { $nin: ['admin', 'operator']} }).select('-__v -password');
    } 
    
    if (userRole === 'admin') {
   
      userList = await User.find({}).select('-__v -password');
    } 

    return userList;
  } catch (error) {
   
    throw error;
  }
}


const isUserHaveAccess = (data, user) => {

 if(!data.user || !user){
return false;
 }
 if(data.user.uid == user._id){
  return true;
 }

 if(data.user.role == "admin" && (user.role != "admin")){
  return true;
 }


 if(data.user.role == "operator" && user.role == "commuter"){
  return true;
 }

return false;
}

module.exports = {
  getUserById,
  updateUserById,
  deleteUserById,
  getUsers,
};

