const express = require('express');
const router  = express.Router();
const {
  submitLeaveRequest,
  getLeaveRequests,
  updateLeaveStatus
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit', protect, submitLeaveRequest);
router.get('/',        protect, getLeaveRequests);
router.put('/:id',     protect, updateLeaveStatus);

module.exports = router;
