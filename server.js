// backend/server.js
require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

// Import routes
const authRoutes    = require('./routes/auth');
const leaveRoutes   = require('./routes/leave');
const otpRoutes     = require('./routes/otpRoutes');
const managerRoutes = require('./routes/manager');

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────

// Enable CORS (allow your React app to send the Bearer token)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Parse incoming JSON
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

// Authentication: register, login (issues JWT), profile, forgot/reset
app.use('/api/auth', authRoutes);

// Leave requests (protected by JWT)
app.use('/api/leave', leaveRoutes);

// OTP endpoints (protected)
app.use('/api/manager/otp', otpRoutes);

// Manager dashboard endpoints (protected + managerOnly if you add that middleware)
app.use('/api/manager', managerRoutes);

// ─── Database & Server ─────────────────────────────────────────────────────────

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Start HTTP server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
