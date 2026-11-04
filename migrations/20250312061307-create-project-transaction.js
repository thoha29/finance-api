'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      rtanggal: {
        type: Sequelize.DATE,
      },
      rreferensi: {
        type: Sequelize.STRING,
      },
      rterang: {
        type: Sequelize.STRING,
      },
      rjumlah: {
        type: Sequelize.DECIMAL(15, 0),
      },
      flag: {
        type: Sequelize.STRING,
      },
      flagpost: {
        type: Sequelize.STRING,
      },
      bunit: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('project_transactions');
  },
};
