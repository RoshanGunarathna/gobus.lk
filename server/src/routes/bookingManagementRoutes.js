const express = require('express');
const { getBooking, updateBooking, getAllBookings, deleteBooking, addBooking} = require('../controllers/bookingManagementController');
 const {protect} = require('../middlewares/authMiddleware');


const router = express.Router();

router.post("/addBooking", protect([,"admin", "operator"]),addBooking);
router.get("/getAllBookings", protect(["admin", "operator"]),getAllBookings);
router.get("/getBooking", protect(["admin", "operator"]),getBooking);
router.post("/updateBooking", protect(["admin", "operator"]),updateBooking);
router.post("/deleteBooking", protect(["admin", "operator"]),deleteBooking);


module.exports = router;
