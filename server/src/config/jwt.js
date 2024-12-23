require('dotenv').config();

const jwtConfig = {
    accessTokenSecret: process.env.JWT_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
    accessTokenExpiry: '15m', 
    refreshTokenExpiry: '7d',
    // accessTokenExpiry: '2s', 
    // refreshTokenExpiry: '7d',
    refreshTokenExpiryAsDateInt: 7,
};

module.exports = jwtConfig;