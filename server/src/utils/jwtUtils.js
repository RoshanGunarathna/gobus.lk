const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const CustomError = require('../utils/customError');

// Generate an access token
const generateAccessToken = (user) => {
    const response = jwt.sign(
        { id: user._id, role: user.role },
        jwtConfig.accessTokenSecret,
        { expiresIn: jwtConfig.accessTokenExpiry }
    );
    console.log("Access Token Generate Successfull");
    return response;
};

// Generate a refresh token
const generateRefreshToken = (user) => {
    const response = jwt.sign(
        { id: user._id, role: user.role },
        jwtConfig.refreshTokenSecret,
        { expiresIn: jwtConfig.refreshTokenExpiry }
    );
    console.log("Refresh Token Generate Successfull");
    return response;
};

// Verify a token
const verifyToken = (token, secret) => {
    try {
        const response = jwt.verify(token, secret);
        console.log("Token Verification Successfull");
        return response;
    } catch (err) {
        throw new CustomError("Invalid token", 400);
    }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
