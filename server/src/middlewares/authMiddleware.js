const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const CustomError = require('../utils/customError');

const protect = (roles = []) => (req, _, next) => {
   
    try {
        const token = req.headers.authorization?.split(' ')[1];
       

        if (!token) {
            throw new CustomError('Authentication required', 401);
        }

        const decoded = jwt.verify(token, jwtConfig.accessTokenSecret);
        req.user = decoded;

        // Check role-based access
        if (roles.length && !roles.includes(decoded.role)) {
            throw new CustomError("Access Denied", 401);
        }
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            if (error.name === 'TokenExpiredError') {
                return next(new CustomError('Access token expired', 401));
              }
            return next(new CustomError("Invalid token", 401));
        }

       
        next(error);
    }
};


module.exports = { protect };
