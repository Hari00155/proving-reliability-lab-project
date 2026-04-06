const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const db = require("./config/database");

const requestRoutes = require("./routes/requestRoutes");
const dailyRoutes = require("./routes/dailyRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// ================= ENSURE UPLOAD FOLDER =================
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
  console.log("📁 uploads folder created");
}

// ================= MIDDLEWARE =================
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ================= STATIC FILE =================
app.use("/uploads", express.static(uploadPath));

// ================= ROUTES =================
app.use("/api/requests", requestRoutes);
app.use("/api/dailyupdates", dailyRoutes);
app.use("/api/reports", reportRoutes);

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
const PORT = process.env.PORT || 10000; // 🔥 IMPORTANT (Render uses PORT)

async function startServer() {
  try {
    // ✅ DB CONNECT
    await db.authenticate();
    console.log("✅ Database Connected");

    await db.sync({ alter: true });
    console.log("✅ Tables Synced");

    // ✅ START SERVER
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ SERVER FAILED:", error.message);
    process.exit(1);
  }
}

startServer();