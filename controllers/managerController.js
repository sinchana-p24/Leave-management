const LeaveRequest = require('../models/LeaveRequest');

const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find().populate('student', 'fullName email');
    res.json(leaveRequests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllLeaveRequests,
};
