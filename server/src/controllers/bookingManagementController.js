const { getBookingById, getCommuters, updateBookingById , getBookings, deleteBookingById, addABooking} = require('../services/bookingManagementService');

const { handleResponse } = require('../utils/responseHandler');


const addBooking = async (req, res, next) => {
  
  try {


 
 
 
    const data = await addABooking(req.body);

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

const updateBooking = async (req, res, next) => {

  try {

    const booking = await updateBookingById(req.body);
    handleResponse(res, 200, 'Booking Update successfully', {booking:booking});
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

const deleteBooking = async (req, res, next) => {

  try {
    const {id} = req.body;

    await deleteBookingById(id);

    handleResponse(res, 200, 'Booking Delete successfully', null);
  } catch (err) {
    next(err);
  }
}

const getAllCommuters = async (req, res, next) => {
  
  try {
    const commuters = await getCommuters();
    handleResponse(res, 200, 'Commuters are retrieved successfully', {commuters: commuters});
  } catch (err) {
    next(err);
  }
};



module.exports = {
  getBooking,
  updateBooking,
  getAllBookings,
  deleteBooking,
  addBooking,
  getAllCommuters
};
