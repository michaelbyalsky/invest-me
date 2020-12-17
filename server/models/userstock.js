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
        foreignKey: "symbol",
        targetKey: "symbol",
      });
    }
  }
  UserStock.init(
    {
      userId: DataTypes.STRING,
      symbol: DataTypes.INTEGER,
      buyPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      sellPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      buyAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      sellAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      operation: DataTypes.ENUM("buy", "sell"),
    },
    {
      sequelize,
      modelName: "UserStock",
    }
  );
  return UserStock;
};
