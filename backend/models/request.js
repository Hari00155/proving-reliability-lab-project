// backend/models/request.js
'use strict'

module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    'Request',
    {
      // ===== BASIC =====
      requestNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userName:  DataTypes.STRING,
      deptId:    DataTypes.STRING,
      date:      DataTypes.DATEONLY,

      // ===== PART DETAILS =====
      partNo:       DataTypes.STRING,
      description:  DataTypes.TEXT,
      platformCode: DataTypes.STRING,
      productCode:  DataTypes.STRING,
      customer:     DataTypes.STRING,
      component:    DataTypes.STRING,

      // ===== TEST =====
      samples:     DataTypes.STRING,
      testType:    DataTypes.STRING,
      category:    DataTypes.STRING,
      testDetails: DataTypes.TEXT,
      special:     DataTypes.TEXT,
      criteria:    DataTypes.TEXT,
      spec:        DataTypes.STRING,
      testName:    DataTypes.STRING,
      standard:    DataTypes.STRING,

      // ===== ACCEPTANCE =====
      acceptanceCriteria: DataTypes.TEXT,
      acceptance:         DataTypes.TEXT,

      // ===== FILE =====
      attachment:     DataTypes.TEXT,        // base64 or server path
      attachmentName: DataTypes.STRING,

      // ===== STATUS =====
      // Pending → Accepted → Allocated → Completed | Rejected
      status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
      },

      // ===== ALLOCATION =====
      allocationPlNo: { type: DataTypes.STRING,   allowNull: true },
      responsibility: { type: DataTypes.STRING,   allowNull: true },
      testRig:        { type: DataTypes.STRING,   allowNull: true },
      startDate:      { type: DataTypes.DATEONLY, allowNull: true },
      requestDate:    { type: DataTypes.DATEONLY, allowNull: true },

      // ===== REJECT =====
      rejectReason: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName:  'requests',
      timestamps: true,   // createdAt / updatedAt — used for archive year filter
    }
  )

  return Request
}