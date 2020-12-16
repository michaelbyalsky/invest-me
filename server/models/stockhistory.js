'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  StockHistory.init({
    symbol: DataTypes.INTEGER,
    lastRate: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'StockHistory',
  });
  return StockHistory;
};