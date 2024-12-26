
const { Booking } = require('../models');
const { User } = require('../models');
const CustomError = require('../utils/customError');
const { Schedule } = require('../models');
const { Bus } = require('../models');
const { Route } = require('../models');
const { generateSmallId } = require('../utils/smallIdGenerator');




const isBookingExist = async (bookingId) => {
  return await Booking.findOne({ bookingId }).select('-__v');
};

const addABooking = async (data) => {
  try {

    if (!data.seats || data.seats<= 0) {
      throw new CustomError("Booking failed: Add at lease one seat", 404);
    }
   

   await isPassingUserIsCommuter(data.commuterId);


    const schedule = await Schedule.findById(data.scheduleId).select('-__v');

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
    
    const newBookedSeats = schedule.bookedSeats + data.seats;
    
    if (busData.seat < newBookedSeats) {
      throw new CustomError("Booking failed: Not enough available seats. Try booking fewer seats.", 400);
    }

    const bookingId = await generateUniqueBookingId();


    const booking = {
      addedDate: new Date(),
      bookingId: bookingId,
      seats: data.seats,
      paySlipNumber: data.paySlipNumber,
      scheduleId: data.scheduleId,
      commuterId: data.commuterId
    }

    await Booking.create(booking);

    await Schedule.findByIdAndUpdate(schedule._id, {bookedSeats : newBookedSeats}, {
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
    var booking = await Booking.findById(data.id).select('-__v');


    if (!booking) {
      throw new CustomError("Booking not found", 404);
    }

   await isPassingUserIsCommuter(booking.commuterId);
 
          
        const  scheduleData = await getScheduleById({ id: booking.scheduleId });
         const commuterData = await getCommuter(booking.commuterId);


          if (!scheduleData || !commuterData) {
            throw new CustomError("Get Booking Fail! : Schedule Or Commuter Data not found", 404);
          }

    booking = {
      _id: booking._id,
      addedDate: booking.addedDate,
      bookingId: booking.bookingId,
      seats: booking.seats,
      paySlipNumber: booking.paySlipNumber,
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

    const oldBooking = await Booking.findById(data.id).select('-__v');


    if (!oldBooking) {
      throw new CustomError("Booking not found", 404);
    }

    if (!data.seats || data.seats<= 0) {
      throw new CustomError("Booking failed: Add at lease one seat", 404);
    }


    await isPassingUserIsCommuter(data.commuterId);

    const schedule = await Schedule.findById(data.scheduleId).select('-__v');

    var busData;
    if(schedule){
      busData = await getBusById({id: schedule.busId});
    }

  

     
    if (!schedule || !busData) {
      throw new CustomError("Booking failed: Schedule or bus data not found.", 404);
    }
    
     
    const newBookedSeats = (schedule.bookedSeats - oldBooking.seats) + data.seats;
    
    if (busData.seat < newBookedSeats) {
      throw new CustomError("Booking failed: Not enough available seats. Try booking fewer seats.", 400);
    }


    const booking = {
      seats: data.seats,
      paySlipNumber: data.paySlipNumber,
      scheduleId: data.scheduleId,
      commuterId: data.commuterId
    }



   
    const updatedBooking = await Booking.findByIdAndUpdate(data.id, booking, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on the update
    }).select('-__v');


    await Schedule.findByIdAndUpdate(data.scheduleId, {bookedSeats : newBookedSeats}, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on the update
    });

    if (!updatedBooking) {
      throw new CustomError("Booking not found!", 404);
    }
    return updatedBooking;
  } catch (error) {

    throw error;
  }
};


const deleteBookingById = async (id) => {
  try {

    var booking = await Booking.findById(id).select('-__v');


    if (!booking) {
      throw new CustomError("Booking not found!", 404);
    }

    const schedule = await Schedule.findById(booking.scheduleId).select('-__v');
     
    if (schedule) {
      const newBookedSeats = schedule.bookedSeats - booking.seats;
      await Schedule.findByIdAndUpdate(schedule._id, {bookedSeats : newBookedSeats}, {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on the update
      });
    }
    
    
  


    const existingBooking = await Booking.findById(id);
    if (!existingBooking) {
      throw new CustomError("Booking not found!", 404);
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

           const  scheduleData = await getScheduleById({ id: booking.scheduleId });
          const   commuterData = await getCommuter(booking.commuterId);

      
          if (scheduleData && commuterData) {
            bookData = {
              _id: booking._id,
              bookingId: booking.bookingId,
              seats: booking.seats,
              paySlipNumber: booking.paySlipNumber,
              addedDate: booking.addedDate,
              scheduleData: scheduleData,
              commuterData: commuterData,
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


const getCommuters = async () => {
  try {
    const commuterList = await User.find({ role: { $in: 'commuter'} }).select('-__v -password');
  
    return commuterList;
  } catch (error) {

    throw error;
  }
}


//Private Functions

const getCommuter = async (uid) => {
  const commuter = await User.findById(uid).select('-__v -password');
  return commuter;
}


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





const isPassingUserIsCommuter = async (uid) => {
  const user = await  getCommuter(uid);

  if(!user){
    throw new CustomError("Communitor not found to save", 404);
  }
  if(user.role != "commuter"){
   
      throw new CustomError("Saving User Is Not A Commuter : Only commuter can book a seat", 400);
 
  }

  
 
 return true;
 }

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
  updateBookingById,
  deleteBookingById,
  getBookings,
  addABooking,
  getCommuters
};

