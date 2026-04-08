const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const db = require("./config/database");

// ================= IMPORT ROUTES =================
const requestRoutes  = require("./routes/requestRoutes");
const dailyRoutes    = require("./routes/dailyRoutes");
const reportRoutes   = require("./routes/reportRoutes");

const app = express();

// ================= ENSURE UPLOAD FOLDER =================
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 uploads folder created");
}

// ================= CORS =================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ================= MIDDLEWARE =================
// 🔥 CRITICAL — must be BEFORE routes
// 50mb limit needed for base64 images/PDFs sent from frontend
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ================= STATIC FILES =================
// Serve uploaded files at /uploads/filename
app.use("/uploads", express.static(uploadPath));

// ================= ROUTES =================
app.use("/api/requests",     requestRoutes);
app.use("/api/dailyupdates", dailyRoutes);
app.use("/api/reports",      reportRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.json({
    status: "✅ API is running...",
    routes: {
      requests:     "/api/requests",
      dailyUpdates: "/api/dailyupdates",
      reports:      "/api/reports",
      uploads:      "/uploads/<filename>"
    }
  });
});

// ================= 404 HANDLER =================
// 🔥 ADDED — catches unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// ================= GLOBAL ERROR HANDLER =================
// 🔥 UPDATED — more detailed error logging
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  // Handle multer errors specifically
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      error: "File too large. Maximum size is 50mb."
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      error: "Unexpected file field in upload."
    });
  }

  // Handle Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      error: err.errors.map(e => e.message).join(", ")
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      error: "Duplicate entry — record already exists."
    });
  }

  // Generic fallback
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {

    // ✅ TEST DB CONNECTION
    await db.authenticate();
    console.log("✅ Database Connected");

    // ✅ SYNC TABLES
    // alter:true — updates columns without dropping data
    // ⚠️ Never use force:true in production (deletes all data)
    await db.sync({ alter: true });
    console.log("✅ Tables Synced");

    // ✅ START SERVER
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Uploads served at http://localhost:${PORT}/uploads`);
      console.log(`🔗 API base: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error("❌ SERVER FAILED TO START:", error.message);
    process.exit(1);
  }
}

startServer();