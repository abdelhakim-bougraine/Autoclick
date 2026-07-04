const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("./controllers/authController");
const { protect, adminOnly } = require("./middleware/authMiddleware");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://autoclick-1.vercel.app"],
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

app.get("/api/auth/users", protect, adminOnly, getUsers);
app.post("/api/auth/users", protect, adminOnly, createUser);
app.put("/api/auth/users/:id", protect, adminOnly, updateUser);
app.delete("/api/auth/users/:id", protect, adminOnly, deleteUser);

const storeRoutes = require("./routes/storeRoutes");
const garageRoutes = require("./routes/garageRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

app.use("/api", storeRoutes);
app.use("/api/garages", garageRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "production") {
  startServer();
}
