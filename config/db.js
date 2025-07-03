const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('userdb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
