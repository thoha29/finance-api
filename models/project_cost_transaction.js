'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project_cost_transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      project_cost_transaction.hasMany(models.project_cost_journal, {
        foreignKey: 'pct_id',
        as: 'journals',
      });

      project_cost_transaction.hasOne(models.ho_advance, {
        foreignKey: 'pct_id',
        sourceKey: 'id',
      });
    }
  }
  project_cost_transaction.init(
    {
      project: DataTypes.STRING,
      location: DataTypes.STRING,
      year: DataTypes.STRING,
      poNo1: DataTypes.STRING,
      poNo2: DataTypes.STRING,
      value: DataTypes.DECIMAL(15, 0),
      total_rab: DataTypes.DECIMAL(15, 0),
    },
    {
      sequelize,
      modelName: 'project_cost_transaction',
    }
  );
  return project_cost_transaction;
};
