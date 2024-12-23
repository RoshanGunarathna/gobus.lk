const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const CustomError = require('../utils/customError');
const {RefreshToken} = require('../models');

// Generate an access token
const generateAccessToken = (user) => {
    const response = jwt.sign(
        { uid: user._id, role: user.role },
        jwtConfig.accessTokenSecret,
        { expiresIn: jwtConfig.accessTokenExpiry }
    );
    console.log("Access Token Generate Successfull");
    return response;
};


const generateRefreshToken = async (user) => {
   
    const token = jwt.sign(
        { uid: user._id, role: user.role },
        jwtConfig.refreshTokenSecret,
        { expiresIn: jwtConfig.refreshTokenExpiry }
    );
  
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + jwtConfig.refreshTokenExpiryAsDateInt);
  
    await RefreshToken.create({
      token,
      userId: user._id,
      expiresAt,
    });

    console.log("Refresh Token Generate Successfull ");
  
    return token;
  };


// Verify a token
const verifyToken = (token, secret) => {
    try {
      
        const response = jwt.verify(token, secret);
        console.log("Token Verification Successfull");
        return response;
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            if (error.name === 'TokenExpiredError') {
                throw new CustomError('Access token expired', 401);
              }
              throw new CustomError("Invalid token", 401);
        }

        throw(error);
    }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
