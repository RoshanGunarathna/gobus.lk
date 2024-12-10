const express = require('express');
const { register, login, refreshToken} = require('../controllers/authController');
const { body } = require("express-validator");
const router = express.Router();
const protect = require("../middlewares/auth");

router.post( "/register",
    [
        body("name").notEmpty(),
        body("email").isEmail(),
        body("password").isLength({ min: 8 }),
    ],
    register);


router.post('/login', login);

// Refresh Token
router.post("/refreshToken", refreshToken);

// Example protected route
router.get("/adminDashboard", protect(["admin"]), (req, res) => {
    res.json({ message: `Welcome, ${req.user.name}` });
});

module.exports = router;
