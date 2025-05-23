// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    parentPhoneNumber: '',
    emergencyPhone: '',
    password: '',
    role: 'student',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const { email, password, phone, parentPhoneNumber, emergencyPhone, role } = formData;
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) return 'Invalid email format.';
    const passRx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passRx.test(password)) return 'Password must be 8+ chars, include upper, lower, number & symbol.';
    const phoneRx = /^[6-9]\d{9}$/;
    if (!phoneRx.test(phone)) return 'Invalid personal phone number.';
    if (role === 'student') {
      if (!phoneRx.test(parentPhoneNumber)) return 'Valid parent phone number is required for students.';
      if (emergencyPhone && !phoneRx.test(emergencyPhone)) return 'Invalid emergency contact number.';
    }
    return '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validateForm();
    if (err) return alert(err);
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');
    } catch (e) {
      alert(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required />
        <input name="email"    value={formData.email}    onChange={handleChange} placeholder="Email"     required />
        <input name="phone"    value={formData.phone}    onChange={handleChange} placeholder="Phone"     required />

        {formData.role === 'student' && (
          <>
            <input
              name="parentPhoneNumber"
              value={formData.parentPhoneNumber}
              onChange={handleChange}
              placeholder="Parent Phone Number"
              required
            />
            <input
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              placeholder="Emergency Contact (optional)"
            />
          </>
        )}

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
