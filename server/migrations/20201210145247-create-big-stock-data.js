'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('big_stock_data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      last_day: {
        type: Sequelize.FLOAT
      },
      last_week: {
        type: Sequelize.FLOAT
      },
      last_month: {
        type: Sequelize.FLOAT
      },
      last_thirty_days: {
        type: Sequelize.FLOAT
      },
      last_three_month: {
        type: Sequelize.FLOAT
      },
      last_six_months: {
        type: Sequelize.FLOAT
      },
      last_nine_months: {
        type: Sequelize.FLOAT
      },
      last_year: {
        type: Sequelize.FLOAT
      },
      last_twelve_months: {
        type: Sequelize.FLOAT
      },
      last_two_years: {
        type: Sequelize.FLOAT
      },
      last_three_years: {
        type: Sequelize.FLOAT
      },
      last_five_years: {
        type: Sequelize.FLOAT
      },
      year_ago_yield: {
        type: Sequelize.FLOAT
      },
      two_years_ago_yield: {
        type: Sequelize.FLOAT
      },
      three_years_ago_yield: {
        type: Sequelize.FLOAT
      },
      four_years_ago_yield: {
        type: Sequelize.FLOAT
      },
      pe: {
        type: Sequelize.FLOAT
      },
      day_change: {
        type: Sequelize.FLOAT
      },
      current_rate: {
        type: Sequelize.FLOAT
      },
      title: {
        type: Sequelize.STRING
      },
      symbol: {
        type: Sequelize.INTEGER,
        foreignKey: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('big_stock_data');
  }
};