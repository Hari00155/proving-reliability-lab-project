module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Report", {

    // ✅ AUTO REPORT NUMBER
    reportNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    // ── Auto-filled from Request ──────────────────────────
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

    component: {                        // 🔥 ADDED — used in frontend report form
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
      type: DataTypes.STRING,          // Purpose of the Test
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

    testName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    spec: {
      type: DataTypes.TEXT,            // Test Equipment (auto from monitoring equipmentName)
      allowNull: true
    },

    date: {                            // 🔥 ADDED — report date (auto-filled)
      type: DataTypes.STRING,
      allowNull: true
    },

    // ── Auto-filled from Monitoring ───────────────────────
    equipmentName: {                   // 🔥 ADDED
      type: DataTypes.STRING,
      allowNull: true
    },

    equipmentNo: {                     // 🔥 ADDED
      type: DataTypes.STRING,
      allowNull: true
    },

    initialReading: {                  // 🔥 ADDED — Initial Counter
      type: DataTypes.STRING,
      allowNull: true
    },

    currentReading: {                  // 🔥 ADDED — Current Counter
      type: DataTypes.STRING,
      allowNull: true
    },

    targetCycle: {                     // 🔥 ADDED — Target Cycle
      type: DataTypes.STRING,
      allowNull: true
    },

    reportBalance: {                   // 🔥 ADDED — Balance / Yet to Cover (computed)
      type: DataTypes.FLOAT,
      allowNull: true
    },

    // ── Manual Entry ──────────────────────────────────────
    criteria: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    observation: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    conclusion: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    result: {
      type: DataTypes.STRING,          // 'Passed' | 'Failed' | 'Completed'
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

    requestedBy: {                     // 🔥 ADDED — auto from request userName
      type: DataTypes.STRING,
      allowNull: true
    },

    // ── Signatures ────────────────────────────────────────
    signatureReported: {               // base64 image (reported by signature)
      type: DataTypes.TEXT,            // 🔥 changed STRING → TEXT (base64 is long)
      allowNull: true
    },

    signatureApproved: {               // base64 image (approved by signature)
      type: DataTypes.TEXT,            // 🔥 changed STRING → TEXT (base64 is long)
      allowNull: true
    },

    // ── Attachments ───────────────────────────────────────
    postDataBase64: {                  // 🔥 ADDED — base64 of uploaded PDF/Excel
      type: DataTypes.TEXT('long'),    // LONGTEXT — files can be several MB
      allowNull: true
    },

    postDataName: {                    // 🔥 ADDED — original filename
      type: DataTypes.STRING,
      allowNull: true
    },

    failurePhotos: {                   // 🔥 ADDED — JSON array of base64 image strings
      type: DataTypes.TEXT('long'),    // stored as JSON.stringify([...])
      allowNull: true,
      get() {
        const val = this.getDataValue('failurePhotos');
        try { return val ? JSON.parse(val) : []; }
        catch { return []; }
      },
      set(val) {
        this.setDataValue('failurePhotos', JSON.stringify(val || []));
      }
    },

  }, {
    timestamps: true
  });
};