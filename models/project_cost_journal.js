'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project_cost_journal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      project_cost_journal.belongsTo(models.project_cost_transaction, {
        foreignKey: 'pct_id', // Kolom di project_cost_journal
        targetKey: 'id', // Kolom di project_cost_transaction
      });

      project_cost_journal.belongsTo(models.project_cost, {
        foreignKey: 'prjCost_code',
        targetKey: 'prjCost_code',
      });
    }
  }
  project_cost_journal.init(
    {
      pct_id: DataTypes.STRING,
      prjCost_code: DataTypes.STRING,
      unit: DataTypes.STRING,
      unit_price: DataTypes.DECIMAL(18, 2),
      qty: DataTypes.INTEGER,
      duration: DataTypes.STRING,
      total: DataTypes.DECIMAL(18, 2),
      description: DataTypes.STRING,
      groupId: DataTypes.STRING(15),
    },
    {
      sequelize,
      modelName: 'project_cost_journal',
    }
  );
  return project_cost_journal;
};
