// frontend/src/pages/ManagerPortal.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManagerPortal = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/manager/all-leave', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaveRequests(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Failed to fetch leave requests');
      }
    };
    fetchLeaveRequests();
  }, []);

  const handleSendOtp = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/manager/${id}/send-otp`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('OTP sent to parent!');
    } catch (err) {
      console.error('Send OTP error:', err);
      alert(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const pending = leaveRequests.filter(r => r.status === 'Pending');
  const approved = leaveRequests.filter(r => r.status === 'Approved');

  return (
    <div className="manager-portal">
      <h2>Manager Portal</h2>
      <button onClick={handleLogout}>Logout</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section>
        <h3>Pending Requests</h3>
        {pending.length === 0
          ? <p>No pending requests.</p>
          : pending.map(req => (
            <div key={req._id} className="leave-request">
              <p><strong>Student:</strong> {req.student?.fullName}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
              <button onClick={() => handleSendOtp(req._id)}>Send OTP</button>
            </div>
          ))
        }
      </section>

      <section>
        <h3>Approved Requests</h3>
        {approved.length === 0
          ? <p>No approved requests.</p>
          : approved.map(req => (
            <div key={req._id} className="leave-request">
              <p><strong>Student:</strong> {req.student?.fullName}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
            </div>
          ))
        }
      </section>
    </div>
  );
};

export default ManagerPortal;
