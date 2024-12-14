const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const CustomError = require('../utils/customError');

const protect = (roles = []) => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new CustomError("Access token missing", 401);
    }

    const decoded = jwt.verify(token, jwtConfig.accessTokenSecret);
    req.user = decoded;

    // Check role-based access
    if (roles.length && !roles.includes(decoded.role)) {
        throw new CustomError("Access denied", 403);
    }

    next();
};

module.exports = { protect };
