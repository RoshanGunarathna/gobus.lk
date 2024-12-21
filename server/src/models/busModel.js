const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
require('dotenv').config();

const BusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true},
  seat: { type: Number, required: true},
});


module.exports = mongoose.model('Bus', BusSchema);
