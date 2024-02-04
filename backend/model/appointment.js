const Sequelize = require('sequelize');

const sequelize = require('../utils/database-config.js');

const appointment = sequelize.define('appointment', {
    id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true
    },
    name: Sequelize.STRING,
    mobile: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    scheduledAt: {
        type: Sequelize.DATE,
        allowNull:false
    },
    isCancelled: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
    }
});

module.exports = appointment;
