const userMoney = require("./seedFiles/userMoney");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("user_moneys", userMoney, {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("user_moneys", userMoney, {});
  }
};

