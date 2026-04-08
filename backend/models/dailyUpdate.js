module.exports = (sequelize, DataTypes) => {
  return sequelize.define("DailyUpdate", {

    // ── Link with Request ─────────────────────────────────
    allocationPlNo: {
      type: DataTypes.STRING,
      allowNull: false
    },

    requestNo: {                        // 🔥 ADDED — link to request
      type: DataTypes.STRING,
      allowNull: true
    },

    partNo: {                           // 🔥 ADDED — from request
      type: DataTypes.STRING,
      allowNull: true
    },

    // ── Product / Test Info ───────────────────────────────
    description: {                      // 🔥 ADDED — product description
      type: DataTypes.TEXT,
      allowNull: true
    },

    customer: {                         // 🔥 ADDED — Cust/Appln
      type: DataTypes.STRING,
      allowNull: true
    },

    testType: {                         // 🔥 ADDED
      type: DataTypes.STRING,
      allowNull: true
    },

    samples: {                          // 🔥 ADDED — No of Samples
      type: DataTypes.STRING,
      allowNull: true
    },

    testDetails: {                      // 🔥 ADDED — Spec/Test Details
      type: DataTypes.TEXT,
      allowNull: true
    },

    // ── Equipment ─────────────────────────────────────────
    equipmentName: {                    // 🔥 ADDED — Equipment Name field
      type: DataTypes.STRING,
      allowNull: true
    },

    equipmentNo: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // ── Standard / Spec ───────────────────────────────────
    standard: {                         // 🔥 ADDED — Standard/Spec field
      type: DataTypes.STRING,
      allowNull: true
    },

    // ── Dates ─────────────────────────────────────────────
    updateDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    requestDate: {                      // 🔥 ADDED — Request Date
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    testStartedOn: {                    // 🔥 ADDED — Test Started On
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    testCompletedOn: {                  // 🔥 ADDED — Test Completed On
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    // ── Cycles / Counter ──────────────────────────────────
    targetCycles: {                     // Target Cycle / Final Counter
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    initialReading: {                   // Initial Hourmeter / Counter
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    currentReading: {                   // Current Reading
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    yetToCover: {                       // ✅ AUTO CALCULATED (target - current)
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    // ── Purpose & Test Content ────────────────────────────
    purpose: {                          // 🔥 ADDED — Purpose of the Test
      type: DataTypes.TEXT,
      allowNull: true
    },

    remarks: {                          // Tryout Details / Remarks
      type: DataTypes.TEXT,
      allowNull: true
    },

    acceptanceCriteria: {               // 🔥 ADDED — Acceptance Criteria
      type: DataTypes.TEXT,
      allowNull: true
    },

    testResults: {                      // 🔥 ADDED — Test Results
      type: DataTypes.TEXT,
      allowNull: true
    },

    // ── Responsibility ────────────────────────────────────
    responsibility: {                   // 🔥 ADDED — default: 'Admin'
      type: DataTypes.STRING,
      defaultValue: "Admin"
    },

    requestedBy: {                      // 🔥 ADDED — auto from request userName
      type: DataTypes.STRING,
      allowNull: true
    },

    // ── Image (existing) ──────────────────────────────────
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    }

  }, {
    timestamps: true
  });
};