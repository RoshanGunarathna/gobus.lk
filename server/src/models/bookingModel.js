const mongoose = require('mongoose');
require('dotenv').config();

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  seats: { type: Number, required: true }, 
  addedDate: { type: Date, required: true },
  paySlipNumber: { type: String, required: true }, 
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  commuterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});


bookingSchema.index({ bookingId: 1 }, { unique: true }); // Ensure unique booking IDs
bookingSchema.index({ scheduleId: 1, addedDate: -1 }); // Optimize queries by schedule and date



module.exports = mongoose.model('Booking', bookingSchema);
