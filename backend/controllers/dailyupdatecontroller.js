const { DailyUpdate } = require("../models");

exports.createDaily = async (req, res) => {
  const data = await DailyUpdate.create(req.body);
  res.json(data);
};

exports.getDaily = async (req, res) => {
  const data = await DailyUpdate.findAll();
  res.json(data);
};