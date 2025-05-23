const LeaveRequest = require('../models/LeaveRequest');

exports.submitLeaveRequest = async (req, res) => {
  try {
    const base = {
      student:           req.user.id,
      studentName:       req.body.studentName,
      studentPhone:      req.body.studentPhone,
      parentPhoneNumber: req.body.parentPhoneNumber,
      roomNumber:        req.body.roomNumber,
      hostelName:        req.body.hostelName,
      branch:            req.body.branch,
      yearSem:           req.body.yearSem,
      homeAddress:       req.body.homeAddress,
    };

    const leaveData = {
      reason:           req.body.reason,
      startDate:        req.body.startDate,
      startTime:        req.body.startTime,
      endDate:          req.body.endDate,
      endTime:          req.body.endTime,
      placeOfStay:      req.body.placeOfStay,
      emergencyContact: req.body.emergencyContact,
    };

    const newLeave = new LeaveRequest({ ...base, ...leaveData });
    await newLeave.save();
    res.status(201).json({ message: 'Leave request submitted successfully' });
  } catch (err) {
    console.error('Submit leave error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLeaveRequests = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ student: req.user.id });
    res.status(200).json(leaves);
  } catch (err) {
    console.error('Get leaves error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    leave.status = req.body.status;
    leave.managerReason = req.body.managerReason;
    await leave.save();
    res.status(200).json({ message: 'Leave status updated' });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
