const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token invalide", error: error.message });
  }
};

exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Accès refusé: administrateur requis" });
  }

  next();
};
