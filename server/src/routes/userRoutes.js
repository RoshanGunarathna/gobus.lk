const express = require('express');
const { getUser, updateUser} = require('../controllers/userController');
// const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router();

// router.get('/getUser', authMiddleware, getUser);
// router.post('/updateUser', authMiddleware, updateUser);
// Example protected route
// router.get("/adminDashboard", protect(["admin"]), (req, res) => {
//     res.json({ message: `Welcome, ${req.user.name}` });
// });

module.exports = router;
