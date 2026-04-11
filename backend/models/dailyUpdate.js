
module.exports = (sequelize, DataTypes) => {
  const DailyUpdate = sequelize.define(
    'DailyUpdate',
    {
      // ===== LINKS TO REQUEST =====
      requestNo:      DataTypes.STRING,
      plNo:           DataTypes.STRING,
      allocationPlNo: DataTypes.STRING,
      partNo:         DataTypes.STRING,

      // ===== AUTO-FILLED FROM REQUEST =====
      description:  DataTypes.TEXT,
      customer:     DataTypes.STRING,
      testType:     DataTypes.STRING,
      samples:      DataTypes.STRING,
      testDetails:  DataTypes.TEXT,
      standard:     DataTypes.STRING,
      purpose:      DataTypes.STRING,
      acceptanceCriteria: DataTypes.TEXT,
      requestedBy:  DataTypes.STRING,
      responsibility: DataTypes.STRING,

      // ===== EQUIPMENT =====
      equipmentName: DataTypes.STRING,
      equipmentNo:   DataTypes.STRING,

      // ===== DATES =====
      date:            DataTypes.STRING,    // display format  DD-MM-YYYY
      requestDate:     DataTypes.DATEONLY,
      testStartedOn:   DataTypes.DATEONLY,
      testCompletedOn: DataTypes.DATEONLY,

      // ===== COUNTERS =====
      targetCycle:    DataTypes.STRING,
      initialReading: DataTypes.STRING,
      currentReading: DataTypes.STRING,

      // ===== NOTES =====
      remarks:      DataTypes.TEXT,
      testResults:  DataTypes.TEXT,

      // ===== STATUS / ALLOCATION PASS-THROUGH =====
      status:    DataTypes.STRING,
      testRig:   DataTypes.STRING,
      startDate: DataTypes.DATEONLY,
    },
    {
      tableName:  'daily_updates',
      timestamps: true,
    }
  )

  return DailyUpdate
}