const { User } = require('../models');

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
 
  return user;
};

const updateUserById = async (id, dataToUpdate)=> {
  
  const user = await User.findByIdAndUpdate(
  id,
  {
    $set: dataToUpdate, 
  },
  {
    new: true // Return the updated document
  }
);
return user;
}

module.exports = {
  getUserById,
  updateUserById,
};
