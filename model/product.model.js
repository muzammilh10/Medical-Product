const mongoose = require('mongoose');

const medicalProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  image: {
    type: String,
    required: true,
    default: 'default.jpg'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  productType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductType',
    required: true
  },
  user: {
    type: String,
    required: true,
  },
  isdeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = new mongoose.model('MedicalProduct', medicalProductSchema);
