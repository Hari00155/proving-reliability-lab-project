const express = require("express");
const cors = require("cors");

const db = require("./config/database");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ VERY IMPORTANT (for file access)
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/requests", requestRoutes);

// ✅ DB
db.authenticate()
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

db.sync({ alter: true }) // ✅ update table
  .then(() => console.log("Table synced"))
  .catch(err => console.log(err));

// ✅ Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});