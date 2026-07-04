const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  category: { 
    type: String, 
    enum: ['Accessoires', 'Entretien', 'Pièces', 'Éclairage', 'Intérieur'], 
    required: true 
  },
  image: { type: String },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);