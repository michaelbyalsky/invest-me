'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Summary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Summary.init({
    symbol: DataTypes.INTEGER,
    lastRate: DataTypes.FLOAT,
    change: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    profit: DataTypes.FLOAT,
    yield: DataTypes.FLOAT,
    avgBuyPrice: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Summary',
  });
  return Summary;
};