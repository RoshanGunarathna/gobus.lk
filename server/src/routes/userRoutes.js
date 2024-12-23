const express = require('express');
const { getUser, updateUser, deleteUser} = require('../controllers/userController');
 const {protect} = require('../middlewares/authMiddleware');


const router = express.Router();

router.get("/getUser", protect(["commuter", "admin", "operator"]),getUser);
router.post("/updateUser", protect(["commuter", "admin", "operator"]),updateUser);
router.post("/deleteUser", protect(["commuter", "admin", "operator"]),deleteUser);

module.exports = router;
