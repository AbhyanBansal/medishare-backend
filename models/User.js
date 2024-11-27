const { hash } = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  dob: { type: Date },
  gender: { type: String  },
  hostel: { type: String, required: true },
  photo: { data: Buffer, type: String },
  availableFrom: { type: String },
  roomno: {type: String}, 
  availableTo: { type: String }, 
  password: {type: String}
});

module.exports = mongoose.model('User', UserSchema);