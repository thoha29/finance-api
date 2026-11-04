'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ho_advances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pct_id: {
        type: Sequelize.STRING,
      },
      total_cost_1: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      third_party_tax: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Pajak pihak ke-3',
      },
      cost_of_money: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      cost_of_money_percent: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      sales_markrting_cost: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_cost_2: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      grand_total_cost: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        comment: 'total_cost_1 + total_cost_2',
      },
      boq_value: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      pph_and_risk: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      nett_revenue: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      management_fee: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      management_fee_percent: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'management_fee / (total_cost_1 + total_cost_2) * 100',
      },
      qtyB: {
        type: Sequelize.INTEGER,
      },
      qtyC: {
        type: Sequelize.INTEGER,
      },
      qtyD: {
        type: Sequelize.INTEGER,
      },
      totalB: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      totalC: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      totalD: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ho_advances');
  },
};
