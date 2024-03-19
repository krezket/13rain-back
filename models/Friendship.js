const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Friendship = sequelize.define('Friendship', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id',
        },
    },
    friend_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id',
        },
    },
    }
);
module.exports = Friendship;