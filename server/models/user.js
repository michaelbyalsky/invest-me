'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.UserStock, {
        foreignKey: 'userId',
      });
      this.hasMany(models.RefreshToken, {
        foreignKey: "username",
      });
      this.hasOne(models.UserMoney, {
        foreignKey: 'userId',
      })
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.TEXT,
    birthDate: DataTypes.DATE,
    permission: DataTypes.ENUM("admin", "user"),
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};