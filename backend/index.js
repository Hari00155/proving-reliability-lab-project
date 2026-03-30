const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./config/database");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILE =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
app.use("/api/requests", requestRoutes);

// ================= ROOT TEST =================
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// ================= START SERVER =================
const PORT = 5000;

async function startServer() {
  try {
    // 🔥 STEP 1: DB CONNECT
    await db.authenticate();
    console.log("✅ Database Connected");

    // 🔥 STEP 2: SYNC TABLE
    await db.sync({ alter: true });
    console.log("✅ Tables Synced");

    // 🔥 STEP 3: START SERVER
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ SERVER FAILED:", error.message);
  }
}

startServer();