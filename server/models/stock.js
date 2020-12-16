"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.UserStock, {
        foreignKey: "stockId", targetKey: "symbol"
      });
      this.hasMany(models.StockHistory, {
        foreignKey: "symbol",
      });
    }
  }
  Stock.init(
    {
      title: DataTypes.STRING,
      symbol: DataTypes.INTEGER,
      lastRate: DataTypes.FLOAT,
      link: DataTypes.STRING,
      todayChangePrecent: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Stock",
    }
  );
  return Stock;
};
