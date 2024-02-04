const Sequelize = require('sequelize');

const sequelize = new Sequelize('Booking-System', 'root', '', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
