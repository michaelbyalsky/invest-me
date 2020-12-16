const userStock = require("./seedFiles/userStock");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("user_stocks", userStock, {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("user_stocks", userStock, {});
  }
};
