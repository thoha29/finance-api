'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_costs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      prjCost_code: {
        type: Sequelize.STRING
      },
      name1: {
        type: Sequelize.STRING
      },
      name2: {
        type: Sequelize.STRING
      },
      name3: {
        type: Sequelize.STRING
      },
      name4: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('project_costs');
  }
};