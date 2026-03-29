const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Request = db.define("Request", {
  date: DataTypes.STRING,
  partNo: DataTypes.STRING,
  description: DataTypes.TEXT,
  platformCode: DataTypes.STRING,
  productCode: DataTypes.STRING,
  customer: DataTypes.STRING,
  samples: DataTypes.INTEGER,
  testType: DataTypes.STRING,
  category: DataTypes.STRING,
  testDetails: DataTypes.TEXT,
  special: DataTypes.TEXT,
  criteria: DataTypes.TEXT,
  spec: DataTypes.STRING,
  testName: DataTypes.STRING,

  filePath: DataTypes.STRING,
  allocationPlNo: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending"
  }

}, {
  tableName: "requests",
  timestamps: true
});

module.exports = Request;