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
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AutoClick API is running");
});

app.get("/api/auth/users", protect, adminOnly, getUsers);
app.post("/api/auth/users", protect, adminOnly, createUser);
app.put("/api/auth/users/:id", protect, adminOnly, updateUser);
app.delete("/api/auth/users/:id", protect, adminOnly, deleteUser);

app.use("/api/auth", authRoutes);

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

startServer();
