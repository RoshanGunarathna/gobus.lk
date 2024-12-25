const mongoose = require('mongoose');
require('dotenv').config();

const ScheduleSchema = new mongoose.Schema({
  scheduleId: { type: String, required: true, unique: true },
  seatPrice: { type: Number, required: true }, 
  bookedSeats: { type: Number, default: 0 }, 
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
});

ScheduleSchema.index({ startTime: 1 }); // Optimize start time queries
ScheduleSchema.index({ routeId: 1, busId: 1 }); // Compound index for route and bus queries


module.exports = mongoose.model('Schedule', ScheduleSchema);
