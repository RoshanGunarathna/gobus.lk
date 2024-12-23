
const { User } = require('../models');
const { RefreshToken } = require('../models');
require('dotenv').config();
const CustomError = require('../utils/customError');
const { generateAccessToken, generateRefreshToken, verifyToken, revokeRefreshToken } = require('../utils/jwtUtils');
const jwtConfig = require('../config/jwt');



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

  const user = await User.create({ name, email, password, role: "commuter" });



  return { statusCode: 201 };
};

const loginUser = async (email, password) => {
  const user = await isUserExist(email);

  if (!user || !(await user.matchPassword(password))) {
    throw new CustomError("Invalid credentials", 400);
  }

  
  const refreshToken = await generateRefreshToken(user);


  const accessToken = generateAccessToken(user);


  // Convert Mongoose document to plain object
  const userObj = user.toObject();

  // Remove sensitive fields
  delete userObj.password;

  return { user: userObj, accessToken, refreshToken };
};

const refreshTokens = async (refreshToken) => {

  if (!refreshToken) {
    throw new CustomError("Refresh token missing", 401);
  }


  const storedToken = await RefreshToken.findOne({ token: refreshToken });

  if (!storedToken) {
    throw new CustomError("Refresh token is not valid", 401);
  }


  if (storedToken.revokedAt) {
    

    throw new CustomError("Refresh token has been revoked", 401);
  }

  if (new Date() > storedToken.expiresAt) {
    throw new CustomError("Refresh token expired", 401);
  }

  const decoded = verifyToken(refreshToken,  jwtConfig.refreshTokenSecret);


  const newAccessToken = generateAccessToken({ _id: decoded.uid, role: decoded.role });

  const newRefreshToken = await generateRefreshToken({ _id: decoded.uid, role: decoded.role });
 


  // Revoke the old refresh token and store the replacement
  revokeRefreshToken({oldRefreshToken: refreshToken, newRefreshToken});

  return {newAccessToken, newRefreshToken};
};





module.exports = { loginUser, registerUser, refreshTokens, revokeRefreshToken };
