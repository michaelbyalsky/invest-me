const bcrypt = require('bcryptjs');
const users = require('./seedFiles/users');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashed = await Promise.resolve(Promise.all(users.map(async (user) => {
      const password = await bcrypt.hashSync(user.password, 10);
      return { password };
    })));

    users.forEach(async (user, i) => {
      user.password = hashed[i].password;
    });
    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
