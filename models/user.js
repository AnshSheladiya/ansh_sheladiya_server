// pages/utils/user.js
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a User model based on the user schema
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
