const express = require("express");
const {
  getGarages,
  getGarage,
  createGarage,
  updateGarage,
  deleteGarage,
  getNearbyGarages,
  updateSubscription,
} = require("../controllers/garageController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/nearby", getNearbyGarages);
router.put("/subscription", protect, adminOnly, updateSubscription);
router.get("/", protect, getGarages);
router.get("/:id", protect, getGarage);
router.post("/", protect, adminOnly, createGarage);
router.put("/:id", protect, adminOnly, updateGarage);
router.delete("/:id", protect, adminOnly, deleteGarage);

module.exports = router;
