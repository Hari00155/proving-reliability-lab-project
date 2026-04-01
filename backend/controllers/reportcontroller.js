const { Report } = require("../models");

exports.createReport = async (req, res) => {
  const data = await Report.create(req.body);
  res.json(data);
};

exports.getReports = async (req, res) => {
  const data = await Report.findAll();
  res.json(data);
};