"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_stocks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.STRING,
      },
      symbol: {
        type: Sequelize.INTEGER,
        foreignKey: true,
      },
      operation: {
        type: Sequelize.DataTypes.ENUM,
        values: ["buy", "sell"],
        defaultValue: "buy",
      },
      sell_price: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      
      buy_price: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      sell_amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      buy_amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_stocks");
  },
};
