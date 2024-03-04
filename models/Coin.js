const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  Country: String,
  "#KM": String,
  Shape: String,
  Composition: String,
  Weight: String,
  Diameter: String,
  Edge: String,
  Year: String,
  Value: String,
  Rarity: String,
  anchorLink: {
    type: String,
    required: true
  }
});


const Coin = mongoose.models.Coin || mongoose.model('Coin', coinSchema);

module.exports = Coin;


