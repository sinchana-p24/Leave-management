// backend/models/Otp.js
const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  code:   { type: String, required: true },
  expiry: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Otp', OtpSchema);
