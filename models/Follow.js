const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

class Follow extends Model {}

Follow.init({
}, {
  sequelize,
  modelName: 'Follow'
});

module.exports = Follow;