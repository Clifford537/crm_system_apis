const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,  // auto-generate using UUID v4
    allowNull: false,
    primaryKey: true
  },
  firstName:     { type: DataTypes.STRING, allowNull: false },
  lastName:      { type: DataTypes.STRING, allowNull: false },
  email:         { type: DataTypes.STRING, allowNull: false, unique: true },
  phoneNumber:   { type: DataTypes.STRING, allowNull: false },
  passport:      { type: DataTypes.STRING },
  idImageFront:  { type: DataTypes.STRING }, 
  idImageBack:   { type: DataTypes.STRING }, 
  password:      { type: DataTypes.STRING, allowNull: false },
  role:          { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' }
}, {
  timestamps: true,
  paranoid: true
});

module.exports = User;
