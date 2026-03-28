const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Request = db.define("Request", {
  date: { type: DataTypes.STRING, allowNull: true },
  partNo: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  platformCode: { type: DataTypes.STRING, allowNull: true },
  productCode: { type: DataTypes.STRING, allowNull: true },
  customer: { type: DataTypes.STRING, allowNull: true },
  samples: { type: DataTypes.INTEGER, allowNull: true },
  testType: { type: DataTypes.STRING, allowNull: true },
  category: { type: DataTypes.STRING, allowNull: true },
  testDetails: { type: DataTypes.TEXT, allowNull: true },
  special: { type: DataTypes.TEXT, allowNull: true },
  criteria: { type: DataTypes.TEXT, allowNull: true },
  spec: { type: DataTypes.STRING, allowNull: true },
  testName: { type: DataTypes.STRING, allowNull: true },
  filePath: { type: DataTypes.STRING, allowNull: true }

}, {
  tableName: "requests",
  timestamps: true
});

module.exports = Request;