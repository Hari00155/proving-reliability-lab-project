const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const db = require("./config/database");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

// ================= ENSURE UPLOAD FOLDER =================
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
  console.log("📁 uploads folder created");
}

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// 🔥 IMPORTANT (for large file/base64)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ================= STATIC FILE =================
app.use("/uploads", express.static(uploadPath));

// ================= ROUTES =================
app.use("/api/requests", requestRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  res.status(500).json({
    error: err.message || "Internal Server Error"
  });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // ✅ DB CONNECT
    await db.authenticate();
    console.log("✅ Database Connected");

    // ✅ SYNC TABLES
    await db.sync({ alter: true });
    console.log("✅ Tables Synced");

    // ✅ START SERVER
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ SERVER FAILED:", error.message);
    process.exit(1);
  }
}

startServer();