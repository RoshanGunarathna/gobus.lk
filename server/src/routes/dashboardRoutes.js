const express = require('express');
const { getDashboardDataForAdmin, getDashboardDataForOperator} = require('../controllers/dashboardController');
 const {protect} = require('../middlewares/authMiddleware');


const router = express.Router();

// "admin", "operator", "commuter"

router.get("/getDashboardDataForAdmin", protect(["admin"]),getDashboardDataForAdmin);
router.get("/getDashboardDataForOperator", protect(["admin", "operator"]),getDashboardDataForOperator);

module.exports = router;
