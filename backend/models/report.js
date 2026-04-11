// backend/models/report.js
'use strict'

module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    'Report',
    {
      // ===== IDENTITY =====
      reportNo:  DataTypes.STRING,
      reqNo:     DataTypes.STRING,
      plNo:      DataTypes.STRING,
      date:      DataTypes.STRING,    // display format DD-MM-YYYY

      // ===== AUTO-FILLED FROM REQUEST =====
      description:  DataTypes.TEXT,
      partNo:       DataTypes.STRING,
      customer:     DataTypes.STRING,
      component:    DataTypes.STRING,
      testName:     DataTypes.STRING,
      special:      DataTypes.TEXT,
      category:     DataTypes.STRING,
      testType:     DataTypes.STRING,
      samples:      DataTypes.STRING,
      standard:     DataTypes.STRING,
      testDetails:  DataTypes.TEXT,
      spec:         DataTypes.STRING,

      // ===== AUTO-FILLED FROM MONITORING =====
      equipmentName:  DataTypes.STRING,
      equipmentNo:    DataTypes.STRING,
      initialReading: DataTypes.STRING,
      currentReading: DataTypes.STRING,
      targetCycle:    DataTypes.STRING,
      reportBalance:  DataTypes.STRING,

      // ===== MANUAL ENTRY =====
      criteria:    DataTypes.TEXT,
      observation: DataTypes.TEXT,
      conclusion:  DataTypes.TEXT,
      result: {
        type: DataTypes.STRING,
        defaultValue: 'Passed',
      },

      // ===== PEOPLE =====
      reportedBy:  DataTypes.STRING,
      approvedBy:  DataTypes.STRING,
      requestedBy: DataTypes.STRING,

      // ===== ATTACHMENTS =====
      // base64 data-URL of the uploaded file
      postDataBase64: DataTypes.LONGTEXT,
      postDataName:   DataTypes.STRING,

      // JSON-serialised array of base64 image strings
      // e.g. '["data:image/jpeg;base64,...", ...]'
      failurePhotos: DataTypes.LONGTEXT,

      // ===== SIGNATURES (base64 image data-URLs) =====
      signReportedPreview: DataTypes.LONGTEXT,
      signApprovedPreview: DataTypes.LONGTEXT,
    },
    {
      tableName:  'reports',
      timestamps: true,
    }
  )

  return Report
}