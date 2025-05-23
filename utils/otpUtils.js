import { createHash } from 'crypto';

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Hash the OTP for secure storage
const hashOTP = (otp) => {
  return createHash('sha256').update(otp).digest('hex');
};

// Validate the OTP by comparing the hash
const validateOTP = (otp, hashedOTP) => {
  return hashOTP(otp) === hashedOTP;
};

export default { generateOTP, hashOTP, validateOTP };