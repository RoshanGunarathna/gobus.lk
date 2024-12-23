const mongoose = require('mongoose');
require('dotenv').config();

const scheduleSchema = new mongoose.Schema({
  scheduleId: { type: String, required: true, unique: true },
  seatPrice: { type: Number, required: true }, 
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
});



module.exports = mongoose.model('Schedule', scheduleSchema);
