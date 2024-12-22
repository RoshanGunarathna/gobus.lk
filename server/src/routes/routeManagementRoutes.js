const express = require('express');
const { getRoute, updateRoute, getAllRoutes, deleteRoute, addRoute} = require('../controllers/routeManagementController');
 const {protect} = require('../middlewares/authMiddleware');


const router = express.Router();

router.post("/addRoute", protect(["admin", "operator"]),addRoute);
router.get("/getAllRoutes", protect(["admin", "operator"]),getAllRoutes);
router.get("/getRoute", protect(["admin", "operator"]),getRoute);
router.post("/updateRoute", protect(["admin", "operator"]),updateRoute);
router.post("/deleteRoute", protect(["admin", "operator"]),deleteRoute);


module.exports = router;
