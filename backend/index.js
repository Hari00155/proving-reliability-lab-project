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

// ================= DB SYNC (FIX HERE) =================
db.sync({ alter: true })   // ✅ VERY IMPORTANT FIX
  .then(() => {
    console.log("✅ Database synced");

    app.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("❌ DB ERROR:", err);
  });