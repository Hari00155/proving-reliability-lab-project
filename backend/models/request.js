module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define("Request", {

    // ===== BASIC =====
    requestNo: {
      type: DataTypes.STRING,
      allowNull: false
    },

    userName: DataTypes.STRING,
    deptId: DataTypes.STRING,
    date: DataTypes.DATEONLY,

    // ===== PART DETAILS =====
    partNo: DataTypes.STRING,
    description: DataTypes.TEXT,
    platformCode: DataTypes.STRING,
    productCode: DataTypes.STRING,
    customer: DataTypes.STRING,

    // ===== TEST =====
    samples: DataTypes.INTEGER,
    testType: DataTypes.STRING,
    category: DataTypes.STRING,
    testDetails: DataTypes.TEXT,
    special: DataTypes.STRING,
    criteria: DataTypes.STRING,
    spec: DataTypes.STRING,
    testName: DataTypes.STRING,

    // ===== FILE =====
    attachment: DataTypes.TEXT,
    attachmentName: DataTypes.STRING,

    // ===== STATUS =====
    status: {
      type: DataTypes.STRING,
      defaultValue: "Pending"
    },

    // ===== ALLOCATION =====
    allocationPlNo: {
      type: DataTypes.STRING,
      allowNull: true
    },

    responsibility: {
      type: DataTypes.STRING,
      allowNull: true
    },

    testRig: {
      type: DataTypes.STRING,
      allowNull: true
    },

    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    // ===== REJECT =====
    rejectReason: {
      type: DataTypes.TEXT,
      allowNull: true
    }

  }, {
    tableName: "requests"
  });

  return Request;
};