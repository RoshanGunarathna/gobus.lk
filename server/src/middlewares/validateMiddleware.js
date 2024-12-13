const { validationResult } = require('express-validator');
const CustomError = require('../utils/customError');

const validate = (req, res, next) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => `${err.msg}`).join(', ');
        throw new CustomError(`Validation failed: ${errorMessages}`, 400); 
    }
    next();
};

module.exports =  {validate};
