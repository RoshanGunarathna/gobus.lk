const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const CustomError = require('../utils/customError');

// Generate an access token
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        jwtConfig.accessTokenSecret,
        { expiresIn: jwtConfig.accessTokenExpiry }
    );
};

// Generate a refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        jwtConfig.refreshTokenSecret,
        { expiresIn: jwtConfig.refreshTokenExpiry }
    );
};

// Verify a token
const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        throw new CustomError("Invalid token", 400);
    }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
