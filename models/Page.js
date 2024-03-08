const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Page extends Model {};

Page.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {    
            type: DataTypes.STRING,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dislikes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },{
        sequelize
    }
);

module.exports = Page;