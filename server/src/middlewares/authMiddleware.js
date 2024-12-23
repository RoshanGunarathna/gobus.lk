const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const CustomError = require('../utils/customError');
const {verifyToken} = require('../utils/jwtUtils');

const protect = (roles = []) => (req, _, next) => {
   
    try {
        const token = req.headers.authorization?.split(' ')[1];
       

        if (!token) {
            throw new CustomError('Authentication required token null', 401);
        }

        const decoded = verifyToken(token, jwtConfig.accessTokenSecret);
        req.user = decoded;

        // Check role-based access
        if (roles.length && !roles.includes(decoded.role)) {
            throw new CustomError("Access Denied", 401);
        }
        next();
    } catch (error) {
        

       
        next(error);
    }
};


module.exports = { protect };
