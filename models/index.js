const User = require('./User');
const Page = require('./Page');
const Comments = require('./Comments');
const Friendship = require('./Friendship');

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
User.hasMany(User, {
    onDelete: 'CASCADE',
    foreignKey: 'owner_id',
    as: 'friends',
});
////////////////////////////
User.belongsToMany(User, {
    through: 'friendship',
    onDelete: 'CASCADE',
    foreignKey: 'user_id',
    otherKey: 'friend_id',
    as: 'friends',
});
////////////////////////////
User.hasMany(Comments, {
    onDelete: 'CASCADE',
    foreignKey: 'owner_id',
    as: 'comments',
});

Comments.belongsTo(User, {
    onDelete: 'CASCADE',
    foreignKey: 'owner_id',
    as: 'users',
});
////////////////////////////
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