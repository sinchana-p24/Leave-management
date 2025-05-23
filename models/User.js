const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName:            { type: String, required: true },
  email:               { type: String, required: true, unique: true },
  phone:               { type: String, required: true },
  parentPhoneNumber:   { type: String, required: function(){return this.role==='student';}},
  emergencyPhone:      { type: String },
  password:            { type: String, required: true, minlength: 8 },
  role:                { type: String, enum: ['student','manager'], default: 'student' },
  resetToken:          String,
  resetTokenExpiry:    Date
},{ timestamps: true });

UserSchema.pre('save', async function(next){
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.index(
  { parentPhoneNumber: 1 },
  { unique: true, partialFilterExpression: { role: 'student' } }
);


module.exports = mongoose.model('User', UserSchema);
