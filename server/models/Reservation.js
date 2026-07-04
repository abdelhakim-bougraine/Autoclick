const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  serviceType: { type: String, enum: ["Lavage", "Mécanique"], required: true },
  garage: { type: mongoose.Schema.Types.ObjectId, ref: "Garage", required: true },
  ville: { type: String, required: true },
  adresse: { type: String, required: true },
  telephone: { type: String, required: true },
  dateRendezVous: { type: Date, required: true },
  descriptionMecanique: { type: String },
  location: {
    lng: { type: Number },
    lat: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reservation", reservationSchema);
