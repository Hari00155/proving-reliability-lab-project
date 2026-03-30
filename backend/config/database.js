const { Sequelize } = require("sequelize");

const db = new Sequelize("lab_requests", "postgres", "Data@123", {
  host: "localhost",
  dialect: "postgres",
  logging: false
});

db.authenticate()
  .then(() => console.log("✅ DB Connected (PostgreSQL)"))
  .catch(err => console.error("❌ DB Connection Error:", err));

module.exports = db;