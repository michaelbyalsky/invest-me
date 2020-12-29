"use strict";
const moment = require("moment");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BigStockData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BigStockData.init(
    {
      title: DataTypes.STRING,
      symbol: DataTypes.STRING,
      lastDay: DataTypes.FLOAT,
      lastWeek: DataTypes.FLOAT,
      lastMonth: DataTypes.FLOAT,
      lastThirtyDays: DataTypes.FLOAT,
      lastThreeMonth: DataTypes.FLOAT,
      lastSixMonths: DataTypes.FLOAT,
      lastNineMonths: DataTypes.FLOAT,
      lastYear: DataTypes.FLOAT,
      lastTwelveMonths: DataTypes.FLOAT,
      lastTwoYears: DataTypes.FLOAT,
      lastThreeYears: DataTypes.FLOAT,
      lastFiveYears: DataTypes.FLOAT,
      yearAgoYield: DataTypes.FLOAT,
      twoYearsAgoYield: DataTypes.FLOAT,
      threeYearsAgoYield: DataTypes.FLOAT,
      fourYearsAgoYield: DataTypes.FLOAT,
      pe: DataTypes.FLOAT,
      dayChange: DataTypes.FLOAT,
      currentRate: DataTypes.FLOAT,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
          return moment(this.getDataValue("created_at")).format("YYYY-MM-DD")
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
          return moment(this.getDataValue("created_at")).format("YYYY-MM-DD");
        },
      },
    },
    {
      sequelize,
      modelName: "BigStockData",
    }
  );
  return BigStockData;
};
