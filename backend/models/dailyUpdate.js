module.exports = (sequelize, DataTypes) => {
  return sequelize.define("DailyUpdate", {
    plNo: DataTypes.STRING,
    reqNo: DataTypes.STRING,
    equipmentNo: DataTypes.STRING,
    updateDate: DataTypes.DATE,
    targetCycles: DataTypes.INTEGER,
    currentReading: DataTypes.INTEGER,
    initialReading: DataTypes.INTEGER,
    yetToCover: DataTypes.INTEGER,
    remarks: DataTypes.TEXT,
    photo: DataTypes.STRING
  });
};