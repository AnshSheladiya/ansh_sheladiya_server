const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  url: {
    type: String,
  },
  coinCount: {
    type: Number,
  }
});

const Country = mongoose.models.Country || mongoose.model('Country', countrySchema);

module.exports = Country;
