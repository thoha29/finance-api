'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ho_advance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ho_advance.belongsTo(models.project_cost_transaction, {
        foreignKey: 'pct_id', // Kolom di ho_advance
        targetKey: 'id', // Kolom di project_cost_transaction
        as: 'project_cost_transaction',
      });
    }
  }
  ho_advance.init(
    {
      pct_id: {
        type: DataTypes.STRING,
      },

      total_cost_1: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },

      third_party_tax: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },

      cost_of_money: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },

      cost_of_money_percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },

      sales_markrting_cost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },

      total_cost_2: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },

      grand_total_cost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },

      boq_value: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },

      pph_and_risk: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },

      nett_revenue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },

      management_fee: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },

      management_fee_percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      qtyB: DataTypes.INTEGER,
      qtyC: DataTypes.INTEGER,
      qtyD: DataTypes.INTEGER,
      totalB: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      totalC: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      totalD: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ho_advance',
    }
  );
  return ho_advance;
};
