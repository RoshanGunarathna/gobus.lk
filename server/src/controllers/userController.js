const { getUserById, updateUserById , deleteUserById,} = require('../services/userService');
const { handleResponse } = require('../utils/responseHandler');


const getUser = async (req, res, next) => {
  
  try {
    const user = await getUserById(req.user.uid);

    handleResponse(res, 200, 'User retrieved successfully', {user: user});
  } catch (err) {
    next(err);
  }
};


const updateUser = async (req, res, next) => {

  try {

    const user = await updateUserById({user:req.user, body: req.body});
    handleResponse(res, 200, 'User Update successfully', {user:user});
  } catch (err) {
    next(err);
  }
};


const deleteUser = async (req, res, next) => {

  try {
    await deleteUserById(req.user.uid);
    handleResponse(res, 200, 'User Delete successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUser,
  updateUser,
  deleteUser
};
