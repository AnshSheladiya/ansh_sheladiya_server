const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswer: {
    type: String,
    required: true,
  },
  imageURL: String,
});

const RTOGujarati = mongoose.models.RTOGujarati || mongoose.model('RTOGujarati', questionSchema);

module.exports = RTOGujarati;
