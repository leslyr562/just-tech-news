const User = require('./user');
const Post = require('./post')
module.exports = { User, Post };

// create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
});