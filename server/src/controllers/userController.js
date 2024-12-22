const { getUserById, updateUserById , getUsers, deleteUserById,} = require('../services/userService');
const { handleResponse } = require('../utils/responseHandler');

const getUser = async (req, res, next) => {
  
  try {
    const {uid} = req.body;
    const user = await getUserById(uid);

    handleResponse(res, 200, 'User retrieved successfully', {user: user});
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {

  try {
    const {uid} = req.body;
  
    const user = await updateUserById(uid);
    handleResponse(res, 200, 'User Update successfully', {user:user});
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  
  try {
    const users = await getUsers();
    handleResponse(res, 200, 'Users are retrieved successfully', {users: users});
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {

  try {
    const {uid} = req.user;

    await deleteUserById(uid);

    handleResponse(res, 200, 'User Delete successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUser,
  updateUser,
  getAllUsers,
  deleteUser
};
