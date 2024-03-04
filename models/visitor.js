// models/Visitor.js
const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Visitor = mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
