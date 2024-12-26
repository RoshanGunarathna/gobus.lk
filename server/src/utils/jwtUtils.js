const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const CustomError = require('../utils/customError');
const { RefreshToken } = require('../models');

// Generate an access token
const generateAccessToken = (user) => {
    const response = jwt.sign(
        { uid: user._id, role: user.role },
        jwtConfig.accessTokenSecret,
        { expiresIn: jwtConfig.accessTokenExpiry }
    );
    console.log("New Access Token Generate Successfull");
    return response;
};


const generateRefreshToken = async (user) => {

    const token = jwt.sign(
        { uid: user._id, role: user.role },
        jwtConfig.refreshTokenSecret,
        { expiresIn: jwtConfig.refreshTokenExpiry }
    );

    const storedTokens = await RefreshToken.find({ userId: user._id });

    if (storedTokens && storedTokens.length > 0) {

        await Promise.all(
            storedTokens.map(async (storedToken) => {

                if (!storedToken.revokedAt) {
                    await revokeRefreshToken({
                        oldRefreshToken: storedToken.token,
                        newRefreshToken: token,
                    });
                }

            })
        );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + jwtConfig.refreshTokenExpiryAsDateInt);

    await RefreshToken.create({
        token,
        userId: user._id,
        expiresAt,
    });

    console.log("New Refresh Token Generate Successfull ");

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

        throw (error);
    }
};

const revokeRefreshToken = async (data) => {
    const storedToken = await RefreshToken.findOne({ token: data.oldRefreshToken });

  

    if (!storedToken) {
        throw new CustomError("Refresh token not found", 401);
    }

    storedToken.revokedAt = new Date();
    storedToken.replacedByToken = data.newRefreshToken;
    await storedToken.save();
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken, revokeRefreshToken };
