const express = require('express');
const { getSchedule, updateSchedule, getAllSchedules, deleteSchedule, addSchedule} = require('../controllers/scheduleManagementController');
 const {protect} = require('../middlewares/authMiddleware');


const router = express.Router();

router.post("/addSchedule", protect(["admin", "operator"]),addSchedule);
router.get("/getAllSchedules", protect(["admin", "operator"]),getAllSchedules);
router.get("/getSchedule", protect(["admin", "operator"]),getSchedule);
router.post("/updateSchedule", protect(["admin", "operator"]),updateSchedule);
router.post("/deleteSchedule", protect(["admin", "operator"]),deleteSchedule);


module.exports = router;
