'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_cost_journals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pct_id: {
        type: Sequelize.STRING,
      },
      prjCost_code: {
        type: Sequelize.STRING,
      },
      unit: {
        type: Sequelize.STRING,
      },
      unit_price: {
        type: Sequelize.DECIMAL(18, 2),
      },
      qty: {
        type: Sequelize.INTEGER,
      },
      duration: {
        type: Sequelize.STRING,
      },
      total: {
        type: Sequelize.DECIMAL(18, 2),
      },
      description: {
        type: Sequelize.STRING,
      },
      groupId: {
        type: Sequelize.STRING(15),
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
    await queryInterface.dropTable('project_cost_journals');
  },
};
