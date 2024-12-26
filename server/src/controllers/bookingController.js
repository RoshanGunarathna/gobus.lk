const { getBookingById, getBookings, cancelBookingById, addABooking} = require('../services/bookingService');
const { handleResponse } = require('../utils/responseHandler');


const addBooking = async (req, res, next) => {
  
  try {

    const data = await addABooking({body: req.body, user:req.user});

    handleResponse(res, data.statusCode, 'Booking added successfully', null);
  } catch (err) {
    next(err);
  }
};



const getBooking = async (req, res, next) => {
  
  try {
    const { id } = req.query;
    const booking = await getBookingById({id, user:req.user});

    handleResponse(res, 200, 'Booking retrieved successfully', {booking: booking});
  } catch (err) {
    next(err);
  }
};



const getAllBookings = async (req, res, next) => {
  
  try {
    const bookings = await getBookings({user: req.user});
    handleResponse(res, 200, 'Bookings are retrieved successfully', {bookings: bookings});
  } catch (err) {
    next(err);
  }
};

const cancelBooking = async (req, res, next) => {

  try {
    const {id} = req.body;

    await cancelBookingById({id, user: req.user} );

    handleResponse(res, 200, 'Booking Delete successfully', null);
  } catch (err) {
    next(err);
  }
}



module.exports = {
  getBooking,
  getAllBookings,
  cancelBooking,
  addBooking
};
