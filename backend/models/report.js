module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Report", {

    // ✅ NEW FIELD (AUTO REPORT NUMBER)
    reportNo: {
      type: DataTypes.STRING,
      allowNull: true
    },

    plNo: {
      type: DataTypes.STRING,
      allowNull: true
    },

    reqNo: {
      type: DataTypes.STRING,
      allowNull: true
    },

    partNo: {
      type: DataTypes.STRING,
      allowNull: true
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    platformCode: {
      type: DataTypes.STRING,
      allowNull: true
    },

    productCode: {
      type: DataTypes.STRING,
      allowNull: true
    },

    customer: {
      type: DataTypes.STRING,
      allowNull: true
    },

    samples: {
      type: DataTypes.STRING,
      allowNull: true
    },

    testType: {
      type: DataTypes.STRING,
      allowNull: true
    },

    category: {
      type: DataTypes.STRING,
      allowNull: true
    },

    testDetails: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    special: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    criteria: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    spec: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    testName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    result: {
      type: DataTypes.STRING,
      allowNull: true
    },

    reportedBy: {
      type: DataTypes.STRING,
      defaultValue: "Admin"
    },

    approvedBy: {
      type: DataTypes.STRING,
      defaultValue: "Superadmin"
    },

    signatureReported: {
      type: DataTypes.STRING,
      allowNull: true
    },

    signatureApproved: {
      type: DataTypes.STRING,
      allowNull: true
    }

  }, {
    timestamps: true // ✅ optional but recommended
  });
};