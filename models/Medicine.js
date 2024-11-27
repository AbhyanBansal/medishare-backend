const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  medicineName: { type: String, required: true },
  medicineMg:{type: Number},
  saltName: { type: String},
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  packagingType: { type: String, required: true },
  hostel: { type: String, required: true },
  roomNumber: { type: String, required: true },
  instructions: { type: String }
});

module.exports = mongoose.model('Medicine', MedicineSchema);