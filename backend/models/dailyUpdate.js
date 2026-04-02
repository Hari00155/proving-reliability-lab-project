module.exports = (sequelize, DataTypes) => {
  return sequelize.define("DailyUpdate", {

    // 🔹 LINK WITH REQUEST
    allocationPlNo: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // 🔹 EQUIPMENT
    equipmentNo: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // 🔹 DATE
    updateDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    // 🔹 CYCLES
    targetCycles: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    currentReading: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    initialReading: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    // 🔥 IMPORTANT (AUTO CALCULATED)
    yetToCover: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    // 🔹 REMARKS
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    // 🔹 IMAGE
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    }

  }, {
    timestamps: true
  });
};