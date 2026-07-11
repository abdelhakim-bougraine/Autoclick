const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs"); // زدنا هادي هنا باش نشفرو المودباس الجديد
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

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow tools and non-browser requests that do not send Origin.
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
};

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};

// إعداد الـ CORS لضمان استقبال الطلبات من الـ Client في الـ Localhost وفي Vercel
app.use(
  cors(corsOptions),
);
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection error" });
  }
});

app.get("/", (req, res) => {
  res.send("server is running");
});

// مسارات التحكم الخاصة بالأدمن فقط
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
    await connectToDatabase();

    // 💡 الكود الجديد والمضمون 100% لإعادة تعيين الحساب والمودباس والرول
    try {
      const User = mongoose.model("User");
      const emailAdmin = "bougrane200@gmail.com";
      
      // تشفير المودباس الجديد اللي اختاريتيه (12345678)
      const hashedPassword = await bcrypt.hash("12345678", 10);

      // غانقلبو واش الإيميل ديجا كاين
      const existingAdmin = await User.findOne({ email: emailAdmin });

      if (existingAdmin) {
        // يلا كاين، غانحدثو ليه المودباس والرول دقة وحدة
        await User.updateOne(
          { email: emailAdmin },
          { $set: { password: hashedPassword, role: "admin" } }
        );
        console.log("🔄 [ADMIN UPDATE]: Le mot de passe a été réinitialisé à '12345678' et le rôle est 'admin'!");
      } else {
        // يلا مكانش كاين كاع الحساب، غانكرييوه نيشان
        await User.create({
          name: "hakim",
          email: emailAdmin,
          password: hashedPassword,
          role: "admin"
        });
        console.log("✨ [ADMIN CREATED]: Compte admin créé avec succès avec le mot de passe '12345678'!");
      }

    } catch (modelError) {
      console.error("Erreur lors de la configuration de l'admin:", modelError.message);
    }

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