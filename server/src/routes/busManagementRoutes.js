const express = require('express');
const { getBus, updateBus, getAllBuses, deleteBus, addBus} = require('../controllers/busManagementController');
 const {protect} = require('../middlewares/authMiddleware');


const router = express.Router();

router.post("/addBus", protect(["admin", "operator"]),addBus);
router.get("/getAllBuses", protect(["admin", "operator"]),getAllBuses);
router.get("/getBus", protect(["admin", "operator"]),getBus);
router.post("/updateBus", protect(["admin", "operator"]),updateBus);
router.post("/deleteBus", protect(["admin", "operator"]),deleteBus);


module.exports = router;
