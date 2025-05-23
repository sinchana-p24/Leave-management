const express = require('express');
const router = express.Router();
const { getAllLeaveRequests } = require('../controllers/managerController');
const { protect, managerOnly } = require('../middleware/authMiddleware');

console.log('protect:', typeof protect);
console.log('managerOnly:', typeof managerOnly);
console.log('getAllLeaveRequests:', typeof getAllLeaveRequests);

router.get('/all-leave', protect, managerOnly, getAllLeaveRequests);

module.exports = router;
