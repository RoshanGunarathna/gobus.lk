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



module.exports = mongoose.model('Booking', bookingSchema);
