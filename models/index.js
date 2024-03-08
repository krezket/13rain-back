const User = require('./User');
const Page = require('./Page');
const Comments = require('./Comments');

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

Page.hasMany(Comments, {
    onDelete: 'CASCADE',
    foreignKey: 'page_id',
    as: 'comments',
});

Comments.belongsTo(Page, {
    onDelete: 'CASCADE',
    foreignKey: 'page_id',
    as: 'pages',
});

// User.hasMany(User,)

module.exports = { User, Page, Comments };