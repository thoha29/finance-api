'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project_cost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      project_cost.hasMany(models.project_cost_journal, {
        foreignKey: 'prjCost_code',
        sourceKey: 'prjCost_code',
      });
    }
  }
  project_cost.init(
    {
      prjCost_code: DataTypes.STRING,
      name1: DataTypes.STRING,
      name2: DataTypes.STRING,
      name3: DataTypes.STRING,
      name4: DataTypes.STRING,
      level: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'project_cost',
    }
  );
  return project_cost;
};
