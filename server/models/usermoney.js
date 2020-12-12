"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserMoney extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  UserMoney.init(
    {
      userId: DataTypes.STRING,
      cash: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "UserMoney",
    }
  );
  return UserMoney;
};
