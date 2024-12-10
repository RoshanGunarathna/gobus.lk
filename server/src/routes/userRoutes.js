const express = require('express');
const { getUser, updateUser} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/getUser', authMiddleware, getUser);
router.post('/updateUser', authMiddleware, upload.single('profilePicture'), updateUser);

module.exports = router;
