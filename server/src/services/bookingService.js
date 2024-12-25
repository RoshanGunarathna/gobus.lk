
const { Booking } = require('../models');
const { User } = require('../models');
const CustomError = require('../utils/customError');
const { Schedule } = require('../models');
const { Bus } = require('../models');
const { Route } = require('../models');
const { generateSmallId } = require('../utils/smallIdGenerator');


// const { getBookingById, getBookings, cancelBookingById, addABooking} 

const isBookingExist = async (bookingId) => {
  return await Booking.findOne({ bookingId }).select('-__v');
};

const addABooking = async (data) => {
  try {
 


    const schedule = await Schedule.findById(data.body.scheduleId).select('-__v');

    var busData;
    if(schedule){
      busData = await getBusById({id: schedule.busId});
    }

     
    if (!schedule || !busData) {
      throw new CustomError("Booking failed: Schedule or bus data not found.", 404);
    }
    
    if (schedule.bookedSeats === busData.seat) {
      throw new CustomError("Booking failed: All seats on the bus are fully booked.", 400);
    }
    
    const newBookedSeats = schedule.bookedSeats + data.body.seats;
    
    if (busData.seat < newBookedSeats) {
      throw new CustomError("Booking failed: Not enough available seats. Try booking fewer seats.", 400);
    }


    const bookingId = await generateUniqueBookingId();

   

    const booking = {
      bookingId: bookingId,
      addedDate: new Date(),
      seats: data.body.seats,
      paySlipNumber: data.body.paySlipNumber,
      scheduleId: data.body.scheduleId,
      commuterId: data.user.uid,
    }

    await Booking.create(booking);

    await Schedule.findByIdAndUpdate(data.scheduleId, {bookedSeats : newBookedSeats}, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on the update
    });

    return { statusCode: 201 };
  } catch (error) {
    throw error;
  }
};


const getBookingById = async (data) => {
  try {

    const booking = await Booking.findOne({ _id: data.id, commuterId: data.user.uid }).select('-__v');
if (!booking) {
  throw new CustomError("Booking not found or you do not have permission to access this booking.", 404);
 
}
        const  scheduleData = await getScheduleById({ id: booking.scheduleId });
      
          if (!scheduleData) {
            throw new CustomError("Get Booking Fail! : Schedule Data not found", 404);
          }

   const bookingData = {
      _id: booking._id,
      bookingId: booking.bookingId,
      seats: booking.seats,
      paySlipNumber: booking.paySlipNumber,
      addedDate: booking.addedDate,
      scheduleData: scheduleData,
    };

    return bookingData;
  } catch (error) {
    throw error;
  }
};


const cancelBookingById = async (data) => {
  try {

    const booking = await Booking.findOne({ _id: data.id, commuterId: data.user.uid }).select('-__v');
    if (!booking) {
      throw new CustomError("Booking not found or you do not have permission to access this booking.", 404);
     
    }

   

    await Booking.findByIdAndDelete(data.id).select('-__v');

    const schedule = await Schedule.findById(booking.scheduleId).select('-__v');
     
    if (schedule) {
      const newBookedSeats = schedule.bookedSeats - booking.seats;
     
      if (newBookedSeats < 0) {
        newBookedSeats = 0;
      }

        await Schedule.findByIdAndUpdate(schedule._id, {bookedSeats : newBookedSeats}, {
          new: true, // Return the updated document
          runValidators: true, // Run schema validators on the update
        });
      
     
    }

    return null;
  } catch (error) {

    throw error;
  }
};


const getBookings = async (data) => {
  try {
    const res = await Booking.find({commuterId: data.user.uid }).select('-__v');
    var bookingList = [];

    if (res && res.length > 0) {
      await Promise.all(
        res.map(async (booking) => {

           const  scheduleData = await getScheduleById({ id: booking.scheduleId });
       

      
          if (scheduleData) {
            bookData = {
              _id: booking._id,
              bookingId: booking.bookingId,
              seats: booking.seats,
              paySlipNumber: booking.paySlipNumber,
              scheduleData: scheduleData,
              addedDate: booking.addedDate,
            };
  
  
  
            bookingList.push(bookData);
          }

         

        })
      );
    }

   


    return bookingList;
  } catch (error) {

    throw error;
  }
};



const getScheduleById = async (data) => {
  
    const schedule = await Schedule.findById(data.id).select('-__v');

     var scheduleData;
    if (schedule) {
      const routeData = await getRouteById({id: schedule.routeId});
      const busData = await getBusById({id: schedule.busId});

      if(routeData && busData){
        scheduleData = {
      _id: schedule._id,
      scheduleId: schedule.scheduleId,
      seatPrice: schedule.seatPrice,
      bookedSeats: schedule.bookedSeats,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      route: routeData,
      bus: busData,
    };       
      }
    }
    return scheduleData;

};



const getRouteById = async (data) => {

    const route = await Route.findById(data.id).select('-__v');
 

    return route;
 
};


const getBusById = async (data) => {
 
    const bus = await Bus.findById(data.id).select('-__v');
    
  

    return bus;
  
};


 const generateUniqueBookingId = async () => {
  let bookingId;
  let isUnique = false;

  while (!isUnique) {
    bookingId = generateSmallId("BK"); 
    const existingBooking = await isBookingExist(bookingId); 

    if (!existingBooking) {
      isUnique = true; 
    }
  }

  return bookingId;
};

module.exports = {
  getBookingById,
  cancelBookingById,
  getBookings,
  addABooking
};

