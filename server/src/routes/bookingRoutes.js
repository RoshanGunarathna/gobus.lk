const express = require('express');
const { getBooking,  getAllBookings, cancelBooking, addBooking} = require('../controllers/bookingController');
 const {protect} = require('../middlewares/authMiddleware');


const router = express.Router();

router.post("/addBooking", protect(["commuter"]),addBooking);
router.get("/getBookings", protect(["commuter"]),getAllBookings);
router.get("/getBooking", protect(["commuter"]),getBooking);
router.post("/cancelBooking", protect(["commuter"]),cancelBooking);


module.exports = router;
