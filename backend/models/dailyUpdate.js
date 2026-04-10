module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "DailyUpdate",
    {
      // ── Link with Request ─────────────────────────────────
      allocationPlNo: {
        type: DataTypes.STRING,
        allowNull: false
      },

      requestNo: {
        type: DataTypes.STRING,
        allowNull: true
      },

      partNo: {
        type: DataTypes.STRING,
        allowNull: true
      },

      // ── Product / Test Info ───────────────────────────────
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      customer: {
        type: DataTypes.STRING,
        allowNull: true
      },

      testType: {
        type: DataTypes.STRING,
        allowNull: true
      },

      samples: {
        type: DataTypes.STRING,
        allowNull: true
      },

      testDetails: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      // ── Equipment ─────────────────────────────────────────
      equipmentName: {
        type: DataTypes.STRING,
        allowNull: true
      },

      equipmentNo: {
        type: DataTypes.STRING,
        allowNull: true
      },

      // ── Standard / Spec ───────────────────────────────────
      standard: {
        type: DataTypes.STRING,
        allowNull: true
      },

      // ── Dates ─────────────────────────────────────────────
      updateDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      requestDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      testStartedOn: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      testCompletedOn: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      // ── Cycles / Counter ──────────────────────────────────
      // 🔥 FIXED: was "targetCycles" — frontend sends "targetCycle"
      targetCycle: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },

      initialReading: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },

      currentReading: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },

      // ✅ AUTO CALCULATED (targetCycle - currentReading)
      yetToCover: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },

      // ── Purpose & Test Content ────────────────────────────
      purpose: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      remarks: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      acceptanceCriteria: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      testResults: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      // ── Responsibility ────────────────────────────────────
      responsibility: {
        type: DataTypes.STRING,
        defaultValue: "Admin"
      },

      requestedBy: {
        type: DataTypes.STRING,
        allowNull: true
      },

      // ── Image (existing) ──────────────────────────────────
      photo: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      timestamps: true
    }
  );
};