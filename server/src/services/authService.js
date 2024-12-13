
const { User } = require('../models');
const {updateUserById} = require('../services/userService');
require('dotenv').config();
const CustomError = require('../utils/customError');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwtUtils');

const refreshTokensStore = [];

// Private method to check if a user exists by email
const isUserExist = async (email) => {
  return await User.findOne({ email }).select('-__v');
};


const registerUser = async (name, email, password) => {

  // Check if the user already exists
  const existingUser = await isUserExist(email);
  if (existingUser) {
    throw new CustomError("User already exists", 400);
    
  }
  
  const user = await User.create({ name, email, password, role:"commuter" });
  


  return {statusCode:201};
};



const loginUser = async (email, password) => {
  const user = await isUserExist(email);

  if (!user || !(await user.matchPassword(password))) {
    throw new CustomError("Invalid credentials", 400);
  }



  

   const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token (replace with DB storage in production)
    refreshTokensStore.push(refreshToken);

    
   // Convert Mongoose document to plain object
   const userObj = user.toObject();

   // Remove sensitive fields
   delete userObj.password;

    return { user:userObj , accessToken, refreshToken };
};

const refreshAccessToken = (refreshToken) => {

  if (!refreshToken) {
    throw new CustomError("Refresh token missing", 401);
}
  // Verify refresh token
  const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

  // Generate a new access token
  const newAccessToken = generateAccessToken({ id: decoded.id, role: decoded.role });

  return newAccessToken;
};

const revokeRefreshToken = (refreshToken) => {
  // Remove refresh token from store
  const index = refreshTokensStore.indexOf(refreshToken);
  if (index !== -1) {
      refreshTokensStore.splice(index, 1);
  }
};
  
  module.exports = { loginUser, registerUser, refreshAccessToken, revokeRefreshToken };
