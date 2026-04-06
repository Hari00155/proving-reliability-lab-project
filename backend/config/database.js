const { Sequelize } = require("sequelize");

// ✅ CREATE INSTANCE (Render uses DATABASE_URL)
const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// ✅ CONNECT FUNCTION
async function connectDB() {
  try {
    await db.authenticate();
    console.log("✅ DB Connected (Render PostgreSQL)");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    process.exit(1);
  }
}

// 🔥 CALL CONNECT
connectDB();

module.exports = db;