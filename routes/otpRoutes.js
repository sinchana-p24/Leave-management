// backend/routes/otpRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect, managerOnly } = require('../middleware/authMiddleware');
const { sendOtp } = require('../controllers/otpController');

// POST /api/manager/:id/send-otp
router.post('/:id/send-otp', protect, managerOnly, sendOtp);

module.exports = router;
