const Reservation = require("../models/Reservation");
const Garage = require("../models/Garage");

exports.bookService = async (req, res) => {
  try {
    const { serviceType, garageId, ville, adresse, telephone, dateRendezVous, descriptionMecanique, location } = req.body;

    if (!serviceType || !garageId || !ville || !adresse || !telephone || !dateRendezVous) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis" });
    }

    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ message: "Garage introuvable" });
    }

    const reservation = await Reservation.create({
      serviceType,
      garage: garageId,
      ville,
      adresse,
      telephone,
      dateRendezVous,
      descriptionMecanique,
      location,
    });

    res.status(201).json({ message: "Réservation validée avec succès", reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
