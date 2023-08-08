const User = require('./User');
const Page = require('./Page');

User.hasMany(Page, {
    onDelete: 'CASCADE',
    foreignKey: 'owner_id',
    as: 'pages',
});

Page.belongsTo(User, {
    onDelete: 'CASCADE',
    foreignKey: 'owner_id',
    as: 'users',
});

// User.hasMany(User,)

module.exports = { User, Page };