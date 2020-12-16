"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserStock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
      });
      this.belongsTo(models.Stock, {
        foreignKey: "symbol", targetKey: "symbol"
      });
    }
  }
  UserStock.init(
    {
      userId: DataTypes.STRING,
      symbol: DataTypes.INTEGER,
      buy_price: DataTypes.FLOAT,
      sell_price: DataTypes.FLOAT,
      buy_amount: DataTypes.INTEGER,
      sell_amount: DataTypes.INTEGER,
      operation: DataTypes.ENUM("buy", "sell"),
    },
    {
      sequelize,
      modelName: "UserStock",
    }
  );
  return UserStock;
};
