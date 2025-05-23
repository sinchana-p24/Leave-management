// backend/controllers/otpController.js
const User = require('../models/User');
const Otp = require('../models/Otp');
const sendSMS = require('../utils/sendSMS');

/**
 * Send a 6-digit OTP to the parent phone of a student.
 */
exports.sendOtp = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const parentNumber = student.parentPhoneNumber;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 mins

    await Otp.findOneAndUpdate(
      { user: studentId },
      { code, expiry },
      { upsert: true, new: true }
    );

    await sendSMS({
      to: parentNumber,
      body: `Your OTP is ${code}. It expires in 5 minutes.`
    });

    res.status(200).json({ message: 'OTP sent to parent phone number.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
