
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const {updateUserById} = require('../services/userService');
require('dotenv').config();

const registerUser = async (name, email, password, role) => {
  
  const user = await User.create({ name, email, password, role });
  res.status(201).json({ message: "User registered successfully" });
};


const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) throw Error("Invalid credentials");

  const accessToken = generateToken(user, process.env.JWT_SECRET, "15m");
  const refreshToken = generateToken(user, process.env.JWT_REFRESH_SECRET, "7d");

  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
  res.json({ accessToken });
  
  const token = generateToken(userId);

  return { user, token ,statusCode};
};



module.exports = {
  loginUser,
  registerUser,
};
