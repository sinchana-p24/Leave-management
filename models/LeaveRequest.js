const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  student:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName:       String,
  studentPhone:      String,
  parentPhoneNumber: String,
  roomNumber:        String,
  hostelName:        String,
  branch:            String,
  yearSem:           String,
  homeAddress:       String,
  reason:            { type: String, required: true },
  startDate:         { type: Date,   required: true },
  startTime:         { type: String, required: true },
  endDate:           { type: Date,   required: true },
  endTime:           { type: String, required: true },
  placeOfStay:       { type: String, required: true },
  emergencyContact:  String,
  status:            { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  managerReason:     String,
},{ timestamps: true });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
