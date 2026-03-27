const Sequelize = require('sequelize');

module.exports = new Sequelize('lab_requests', 'postgres', 'Data@123', {
  host: 'localhost',
  dialect: 'postgres'
});