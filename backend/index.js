const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./config/database");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC FILES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.use("/api/requests", requestRoutes);

// DB CONNECT
db.authenticate()
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

// AUTO UPDATE TABLE
db.sync({ alter: true })
  .then(() => console.log("Table synced"))
  .catch(err => console.log(err));

// SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});