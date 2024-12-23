const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  expiresAt: { type: Date, required: true }, 
  revokedAt: { type: Date }, 
  replacedByToken: { type: String }, 
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
