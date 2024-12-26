const express = require('express');
const { getDashboardData,} = require('../controllers/dashboardController');
 const {protect} = require('../middlewares/authMiddleware');


const router = express.Router();

// "admin", "operator", "commuter"

router.get("/getDashboardData", protect(["admin", "operator"]),getDashboardData);

module.exports = router;
