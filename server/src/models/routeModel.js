const mongoose = require('mongoose');
require('dotenv').config();

const RouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  routeId: { type: String, required: true, unique: true},
});


module.exports = mongoose.model('Route', RouteSchema);
