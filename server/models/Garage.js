const mongoose = require('mongoose');

const garageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['Lavage', 'Mécanique', 'Dépannage'], required: true },
  
  // 1. الإحداثيات الجغرافية (GeoJSON)
  location: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number], // [Longitude, Latitude] - ردي البال الترتيب مهم!
      required: true
    }
  },

  // 2. حالة الاشتراك
  isSubscribed: { type: Boolean, default: false },
  subscriptionEndDate: { type: Date }, // تاريخ انتهاء الاشتراك
  
  address: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

// ضروري تزيد هاد الـ Index باش تخدم الـ Search بـ "القرب"
garageSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Garage', garageSchema);