const express = require('express');
const { getShedule, updateShedule, getAllShedules, deleteShedule, addShedule} = require('../controllers/sheduleManagementController');
 const {protect} = require('../middlewares/authMiddleware');


const router = express.Router();

router.post("/addShedule", protect(["admin", "operator"]),addShedule);
router.get("/getAllShedules", protect(["admin", "operator"]),getAllShedules);
router.get("/getShedule", protect(["admin", "operator"]),getShedule);
router.post("/updateShedule", protect(["admin", "operator"]),updateShedule);
router.post("/deleteShedule", protect(["admin", "operator"]),deleteShedule);


module.exports = router;
