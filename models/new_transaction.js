'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class new_transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  new_transaction.init({
    project_id: DataTypes.STRING,
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    range: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    approval: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'new_transaction',
  });
  return new_transaction;
};