const bigData = require("./seedFiles/allStocks");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const newBigData = bigData.map((stock) => ({
      ...stock,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    await queryInterface.bulkInsert("big_stock_data", newBigData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("big_stock_data", null, {});
  },
};
