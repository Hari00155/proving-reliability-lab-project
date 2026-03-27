const express = require("express");
const cors = require("cors");
const multer = require("multer");

const db = require("./config/database");
const requestRoutes = require("./routes/requestRoutes");

const app = express();
const upload = multer();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.none()); // ✅ IMPORTANT for FormData

// ✅ Routes
app.use("/api/requests", requestRoutes);

// ✅ DB
db.authenticate()
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

db.sync()
  .then(() => console.log("Table created"))
  .catch(err => console.log(err));

// ✅ Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});