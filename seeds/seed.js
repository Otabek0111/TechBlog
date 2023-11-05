const sequelize = require('../config/connection');
const { User, Post } = require('../models');

const seedUsers = require('./userData');
const seedPosts = require('./postData');

const seedAll = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(seedUsers, {
        individualHooks: true,
        returning: true,
    });

    for (const post of seedPosts) {
        await Post.create({
            ...post,
            user_id: users[Math.floor(Math.random() * users.length)].id,
        });
    }

    process.exit(0);
}

seedAll();  
