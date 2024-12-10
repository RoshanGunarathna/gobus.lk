const { getUserById, updateUserById } = require('../services/userService');
const { handleResponse } = require('../utils/responseHandler');

const getUser = async (req, res, next) => {
  
  try {
    const user = await getUserById(req.user.id);
    handleResponse(res, 200, 'User retrieved successfully', {user: user});
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {

  try {
    const {name, email} = req.body;
    let updateData = { name, email };

    // Check if a file is exist
    if (req.file) {
      updateData.profilePictureUrl = req.file.location;
    }

    const user = await updateUserById(req.user.id, updateData);
    handleResponse(res, 200, 'User Update successfully', {user:user});
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUser,
  updateUser,
};
