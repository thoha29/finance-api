'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_cost_transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      project: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      year: {
        type: Sequelize.STRING,
      },
      poNo1: {
        type: Sequelize.STRING,
      },
      poNo2: {
        type: Sequelize.STRING,
      },
      total_cost: {
        type: Sequelize.DECIMAL(15, 0),
      },
      total_rab: {
        type: Sequelize.DECIMAL(15, 0),
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
    await queryInterface.dropTable('project_cost_transactions');
  },
};
