const nodemailer = require('nodemailer');
const validator  = require('validator');
const jwt        = require('jsonwebtoken');
const User       = require('../models/User');
const bcrypt     = require('bcryptjs');
const crypto     = require('crypto');

const registerUser = async (req, res) => {
  console.log('Register body:', req.body);
  try {
    const { fullName, email, phone, password, role, parentPhoneNumber, emergencyPhone } = req.body;

    if (!['student','manager'].includes(role)) 
      return res.status(400).json({ message: 'Invalid or missing role' });

    if (![fullName,email,phone,password].every(Boolean)) 
      return res.status(400).json({ message: 'Missing required fields' });

    if (!validator.isEmail(email)) 
      return res.status(400).json({ message: 'Invalid email' });

    if (!validator.isMobilePhone(phone,'en-IN')) 
      return res.status(400).json({ message: 'Invalid phone' });

    // STUDENT-specific validation
    if (role === 'student') {
      if (!parentPhoneNumber || !validator.isMobilePhone(parentPhoneNumber, 'en-IN'))
        return res.status(400).json({ message: 'Valid parent phone required' });

      if (emergencyPhone && !validator.isMobilePhone(emergencyPhone, 'en-IN'))
        return res.status(400).json({ message: 'Invalid emergency phone' });
    }

    // Check duplicates
    const exists = await User.findOne({
      $or: [
        { email },
        { phone },
        ...(role === 'student' ? [{ parentPhoneNumber }] : [])
      ]
    });
    if (exists)
      return res.status(400).json({ message: 'Email or phone already in use' });

    // Build user data conditionally
    const userData = { fullName, email, phone, password, role };
    if (role === 'student') {
      userData.parentPhoneNumber = parentPhoneNumber;
      if (emergencyPhone) userData.emergencyPhone = emergencyPhone;
    }

    const user = new User(userData);
    await user.save();
    res.status(201).json({ message: 'Registration successful' });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) 
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const user = await User.findOne({ email });
    if (!user) 
      return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) 
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) 
    return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) 
      return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken       = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1h
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('ForgotPassword error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) 
    return res.status(400).json({ message: 'Token and new password required' });

  if (!validator.isStrongPassword(password, { minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1 }))
    return res.status(400).json({ message: 'Password not strong enough' });

  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) 
      return res.status(400).json({ message: 'Invalid or expired token' });

    user.password          = await bcrypt.hash(password, 10);
    user.resetToken        = undefined;
    user.resetTokenExpiry  = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('ResetPassword error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ME (profile)
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, getMe };
