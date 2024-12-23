const express = require('express');
const {register, login, refreshToken, logout } = require('../controllers/authController');
const router = express.Router();
const { registerValidation, loginValidation } = require('../validations/authValidation');
const { validate } = require('../middlewares/validateMiddleware');

router.post( "/register",registerValidation, validate, register);


router.post('/login', loginValidation, validate, login);

// Refresh Token
router.post("/refreshToken", refreshToken);
router.post('/logout', logout);



module.exports = router;
