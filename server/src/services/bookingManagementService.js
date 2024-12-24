
const { Booking } = require('../models');
const { User } = require('../models');
const CustomError = require('../utils/customError');
const { getScheduleById } = require('./scheduleManagementService');
const { Schedule } = require('../models');
const { getBusById } = require('./busManagementService');


const isBookingExist = async (bookingId) => {
  return await Booking.findOne({ bookingId }).select('-__v');
};

const addABooking = async (data) => {
  try {



    const existingBooking = await isBookingExist(data.id);

    if (existingBooking) {
      throw new CustomError("Booking already exists", 400);
    }


    const schedule = await Schedule.findById(data.scheduleId).select('-__v');

    const busData = await getBusById({id: schedule.busId});

     
    if (!schedule || !busData) {
      throw new CustomError("Schedule Or Bus not found", 404);
    }


    const newBookedSeats = schedule.bookedSeats + data.seats;

    if(busData.seat < newBookedSeats){
      throw new CustomError("Bus seats passing fail!", 400);
    } 

      
 

    



    const booking = {
      bookingId: data.bookingId,
      seats: data.seats,
      paySlipNumber: data.paySlipNumber,
      scheduleId: data.scheduleId,
      commuterId: data.commuterId
    }

    await Booking.create(booking);

    await Schedule.findByIdAndUpdate(data.scheduleId, {bookedSeats : newBookedSeats}, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on the update
    }).select('-__v');

    return { statusCode: 201 };
  } catch (error) {
    throw error;
  }
};


const getBookingById = async (data) => {
  try {
    var booking = await Booking.findById(data.id).select('-__v');


    if (!booking) {
      throw new CustomError("Booking not found", 404);
    }

    var scheduleData;
          var commuterData;
          try {
            scheduleData = await getScheduleById({ id: booking.scheduleId });
            commuterData = await getCommuter(booking.commuterId);


          } catch (error) {
            throw new CustomError("Schedule Or Commuter Data not found", 404);
          }


          if (!scheduleData || !commuterData) {
            throw new CustomError("Schedule Or Commuter Data not found", 404);
          }

    booking = {
      _id: booking._id,
      bookingId: booking.bookingId,
      scheduleData: scheduleData,
      commuterData: commuterData,
    };

    return booking;
  } catch (error) {
    throw error;
  }
};




const updateBookingById = async (data) => {
  try {

    const updatedBooking = await Booking.findByIdAndUpdate(data.body.id, data.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on the update
    }).select('-__v');

    if (!updatedBooking) {
      throw new CustomError("Booking not found", 404);
    }

    return updatedBooking;
  } catch (error) {

    throw error;
  }
};


const deleteBookingById = async (id) => {
  try {
    const existingBooking = await Booking.findById(id);
    if (!existingBooking) {
      throw new CustomError("Booking not found", 404);
    }

    await Booking.findByIdAndDelete(id).select('-__v');

    return null;
  } catch (error) {

    throw error;
  }
};


const getBookings = async () => {
  try {
    const res = await Booking.find({}).select('-__v');
    var bookingList = [];

    if (res && res.length > 0) {
      await Promise.all(
        res.map(async (booking) => {


          var scheduleData;
          var commuterData;
          try {
            scheduleData = await getScheduleById({ id: booking.scheduleId });
            commuterData = await getCommuter(booking.commuterId);


          } catch (error) {
            throw new CustomError("Schedule Or Commuter Data not found", 404);
          }



          if (!scheduleData || !commuterData) {
            throw new CustomError("Schedule Or Commuter Data not found", 404);
          }

          booking = {
            _id: booking._id,
            bookingId: booking.bookingId,
            scheduleData: scheduleData,
            commuterData: commuterData,
          };



          bookingList.push(booking);

        })
      );
    }

   


    return bookingList;
  } catch (error) {

    throw error;
  }
};

const getCommuter = async (uid) => {
  const commuter = await User.findById(uid).select('-__v -password');
  return commuter;
}



module.exports = {
  getBookingById,
  updateBookingById,
  deleteBookingById,
  getBookings,
  addABooking
};

