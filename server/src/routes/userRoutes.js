const express = require('express');
const { getUser, updateUser, getAllUsers, deleteUser} = require('../controllers/userController');
 const {protect} = require('../middlewares/authMiddleware');


const router = express.Router();

// "admin", "operator", "commuter"

router.get("/getAllUsers", protect(["admin", "operator"]),getAllUsers);
router.get("/getUser", protect(["commuter", "admin", "operator"]),getUser);
router.get("/updateUser", protect(["commuter", "admin", "operator"]),updateUser);

module.exports = router;
