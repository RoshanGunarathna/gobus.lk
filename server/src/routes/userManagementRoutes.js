const express = require('express');
const { getUser, updateUser, getAllUsers, deleteUser} = require('../controllers/userManagementController');
 const {protect} = require('../middlewares/authMiddleware');


const router = express.Router();

// "admin", "operator", "commuter"

router.get("/getAllUsers", protect(["admin", "operator"]),getAllUsers);

router.get("/getUser", protect(["admin", "operator"]),getUser);
router.post("/updateUser", protect(["admin", "operator"]),updateUser);
router.post("/deleteUser", protect(["admin", "operator"]),deleteUser);


module.exports = router;
