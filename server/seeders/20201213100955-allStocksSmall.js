const allStocksSmall = require("./seedFiles/allStocksSmall");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("stocks", allStocksSmall, {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("stocks", allStocksSmall, {});
  }
};

