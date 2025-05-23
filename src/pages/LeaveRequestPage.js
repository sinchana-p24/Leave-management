// src/pages/LeaveRequestPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LeaveRequestPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    reason: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    placeOfStay: '',
    emergencyContact: '',
  });

  // Fetch student profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile", err);
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  // Handle changes in leave form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  // Handle changes in editable profile fields
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  // Submit leave request
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const payload = {
      studentName: profile.fullName,
      studentPhone: profile.phone,
      parentPhoneNumber: profile.parentPhoneNumber,
      roomNumber: profile.roomNumber,
      hostelName: profile.hostelName,
      branch: profile.branch,
      yearSem: profile.yearSem,
      homeAddress: profile.homeAddress,
      ...formData
    };

    try {
      await axios.post('http://localhost:5000/api/leave/submit', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Leave request submitted successfully!');
    } catch (err) {
      alert('Failed to submit leave request.');
      console.error(err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!profile) return <div>Loading your info…</div>;

  return (
    <div className="leave-request-page" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Submit Leave Request</h2>
        <button onClick={handleLogout} style={{ padding: '6px 12px' }}>Logout</button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Readonly fields */}
        <input type="text" value={profile.fullName} readOnly placeholder="Student Name" />
        
        {/* Editable profile fields */}
        <input type="text" name="roomNumber" value={profile.roomNumber} onChange={handleProfileChange} placeholder="Room Number" required />
        <input type="text" name="hostelName" value={profile.hostelName} onChange={handleProfileChange} placeholder="Hostel Name" required />
        <input type="text" name="branch" value={profile.branch} onChange={handleProfileChange} placeholder="Branch" required />
        <input type="text" name="yearSem" value={profile.yearSem} onChange={handleProfileChange} placeholder="Year/Sem" required />
        <input type="text" name="homeAddress" value={profile.homeAddress} onChange={handleProfileChange} placeholder="Home Address" required />

        <input type="tel" value={profile.parentPhoneNumber} readOnly placeholder="Parent Phone" />
        <input type="tel" value={profile.phone} readOnly placeholder="Your Phone" />

        {/* Leave form fields */}
        <label>Leaving Date & Time</label>
        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />

        <label>Arriving Date & Time</label>
        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />

        <textarea
          name="reason"
          placeholder="Reason for leave"
          value={formData.reason}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="placeOfStay"
          placeholder="Place of stay during leave"
          value={formData.placeOfStay}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="emergencyContact"
          placeholder="Emergency Contact (optional)"
          value={formData.emergencyContact}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LeaveRequestPage;
