
const { Booking } = require('../models');
const { User } = require('../models');
const { Schedule } = require('../models');
const { Bus } = require('../models');
const { Route } = require('../models');


const getDashboardDataForAdminFn = async () => {
  try {
    // Initialize variables
    let totalBookings = 0;
    let totalCommuters = 0;
    let totalRoutes = 0;
    let totalRevenue = 0;
    let availableSeats = 0;
    let totalBookedSeats = 0;
    let revenueWithDateList = [];

    // Total Bookings
    const bookings = await Booking.find({});
    totalBookings = bookings.length;

    // Total Commuters
    const commuterList = await User.find({ role: 'commuter' });
    totalCommuters = commuterList.length;

    // Total Routes
    const routes = await Route.find({});
    totalRoutes = routes.length;

    // Total Revenue and Revenue By Date
    const schedules = await Schedule.find({});
    schedules.forEach((schedule) => {
      const scheduleRevenue = schedule.bookedSeats * schedule.seatPrice;
      totalRevenue += scheduleRevenue;

      // Group revenue by date
      const dateKey = schedule.startTime.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const existingRevenue = revenueWithDateList.find((item) => item.date === dateKey);

      if (existingRevenue) {
        existingRevenue.revenue += scheduleRevenue;
      } else {
        revenueWithDateList.push({ date: dateKey, revenue: scheduleRevenue });
      }
    });

    // Total Seats and Available Seats
    const buses = await Bus.find({});
    buses.forEach((bus) => {
      availableSeats += bus.seat; // Sum up all available seats in buses
    });

    schedules.forEach((schedule) => {
      totalBookedSeats += schedule.bookedSeats; // Sum up booked seats
    });

    // Calculate truly available seats
    availableSeats -= totalBookedSeats;

    // Prepare return data
    const returnData = {
      totalBookings,
      totalCommuters,
      totalRoutes,
      totalRevenue,
      availableSeats,
      totalBookedSeats,
      revenueWithDateList,
    };

    return returnData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error.message);
    throw error;
  }
};




const getDashboardDataForOperatorFn = async () => {
  try {
    // Initialize variables
    let totalBookings = 0;
    let totalCommuters = 0;
    let totalRoutes = 0;
    let availableSeats = 0;
    let totalBookedSeats = 0;
    let bookingWithDateList = [];

    // Total Bookings
    const bookings = await Booking.find({});
    totalBookings = bookings.length;

    // Total Commuters
    const commuterList = await User.find({ role: 'commuter' });
    totalCommuters = commuterList.length;

    // Total Routes
    const routes = await Route.find({});
    totalRoutes = routes.length;

    // Total Revenue and Revenue By Date
    const schedules = await Schedule.find({});

    // Total Seats and Available Seats
    const buses = await Bus.find({});
    buses.forEach((bus) => {
      availableSeats += bus.seat; // Sum up all available seats in buses
    });

    schedules.forEach((schedule) => {
      totalBookedSeats += schedule.bookedSeats; // Sum up booked seats
    });



    bookings.forEach((booking) => {
    
      const bookingSeats = booking.seats;
     const addedDate = booking.addedDate;

     console.log("bookingSeats",bookingSeats);
     console.log("addedDate",addedDate);

      // Group revenue by date
      const dateKey = addedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
        bookingWithDateList.push({ date: dateKey, bookings: bookingSeats });    

    });



    // Calculate truly available seats
    availableSeats -= totalBookedSeats;

    // Prepare return data
    const returnData = {
      totalBookings,
      totalCommuters,
      totalRoutes,
      availableSeats,
      totalBookedSeats,
      bookingWithDateList
    };

    return returnData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error.message);
    throw error;
  }
};





module.exports = { getDashboardDataForAdminFn, getDashboardDataForOperatorFn };
