'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  StockData.init({
    symbol: DataTypes.STRING,
    lastRate: DataTypes.FLOAT,
    link: DataTypes.STRING,
    todayChangePrecent: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'StockData',
  });
  return StockData;
};