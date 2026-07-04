const Garage = require('../models/Garage');

exports.getGarages = async (req, res) => {
  try {
    const garages = await Garage.find().populate("owner", "name email").sort({ createdAt: -1 });
    res.json({ garages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGarage = async (req, res) => {
  try {
    const garage = await Garage.findById(req.params.id).populate("owner", "name email");
    if (!garage) return res.status(404).json({ message: "Garage introuvable" });
    res.json(garage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGarage = async (req, res) => {
  try {
    const { name, type, location, address, phone } = req.body;
    const garage = await Garage.create({ name, type, location, address, phone, owner: req.user._id });
    res.status(201).json(garage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateGarage = async (req, res) => {
  try {
    const garage = await Garage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!garage) return res.status(404).json({ message: "Garage introuvable" });
    res.json(garage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteGarage = async (req, res) => {
  try {
    const garage = await Garage.findByIdAndDelete(req.params.id);
    if (!garage) return res.status(404).json({ message: "Garage introuvable" });
    res.json({ message: "Garage supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNearbyGarages = async (req, res) => {
    try {
        // 1. استلام موقع المستخدم من الـ Frontend
        const { lng, lat, type } = req.query;

        if (!lng || !lat) {
            return res.status(400).json({ message: "La position est requise" });
        }

        // 2. البحث عن الجراجات القريبة (مثلاً في حدود 10km)
        // مع التأكد أن الاشتراك ما زال ساري المفعول
        const garages = await Garage.find({
            isSubscribed: true, // فقط الجراجات اللي مخلصة الشهرية
            subscriptionEndDate: { $gte: new Date() }, // الاشتراك خاص يكون أكبر من تاريخ اليوم
            type: type || { $exists: true }, // تصفية حسب النوع (Lavage, Mécanique...)
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 10000 // المسافة بالمتر (هنا 10 كلم)
                }
            }
        });

        res.status(200).json({
            success: true,
            count: garages.length,
            data: garages
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// تحديث حالة الاشتراك (للمسؤول فقط)
exports.updateSubscription = async (req, res) => {
    try {
        const { garageId, months } = req.body;
        
        // إضافة عدد الأشهر لتاريخ الانتهاء
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + months);

        const garage = await Garage.findByIdAndUpdate(garageId, {
            isSubscribed: true,
            subscriptionEndDate: endDate
        }, { new: true });

        res.status(200).json({ message: "Abonnement mis à jour", data: garage });
    } catch (error) {
        res.status(500).json({ message: "Erreur de paiement", error: error.message });
    }
};