module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Report", {
    plNo: DataTypes.STRING,
    reqNo: DataTypes.STRING,
    partNo: DataTypes.STRING,
    description: DataTypes.TEXT,
    platformCode: DataTypes.STRING,
    productCode: DataTypes.STRING,
    customer: DataTypes.STRING,
    samples: DataTypes.STRING,
    testType: DataTypes.STRING,
    category: DataTypes.STRING,
    testDetails: DataTypes.TEXT,
    special: DataTypes.TEXT,
    criteria: DataTypes.TEXT,
    spec: DataTypes.TEXT,
    testName: DataTypes.STRING,
    result: DataTypes.STRING,
    reportedBy: DataTypes.STRING,
    approvedBy: DataTypes.STRING,
    signatureReported: DataTypes.STRING,
    signatureApproved: DataTypes.STRING
  });
};