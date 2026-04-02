const { Sequelize } = require("sequelize");

// ✅ CREATE INSTANCE
const db = new Sequelize(
  "lab_requests",   // DB NAME
  "postgres",       // USER
  "Data@123",       // PASSWORD
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,

    // 🔥 IMPORTANT (fix common connection issues)
    dialectOptions: {
      ssl: false
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// ✅ CONNECT FUNCTION
async function connectDB() {
  try {
    await db.authenticate();
    console.log("✅ DB Connected (PostgreSQL)");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    process.exit(1);
  }
}

// 🔥 CALL CONNECT
connectDB();

module.exports = db;