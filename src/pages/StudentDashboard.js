// frontend/src/pages/StudentDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/leave', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaveRequests(response.data);
    };
    fetchLeaveRequests();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="student-dashboard">
      <h2>Student Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate('/leave-request')}>Submit Leave Request</button>
      {leaveRequests.map((request) => (
        <div key={request._id} className="leave-request">
          <p><strong>Reason:</strong> {request.reason}</p>
          <p><strong>Status:</strong> {request.status}</p>
        </div>
      ))}
    </div>
  );
};

export default StudentDashboard;
