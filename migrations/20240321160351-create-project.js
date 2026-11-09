'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      project_code: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      key_person_id: {
        type: Sequelize.STRING,
      },
      customer_id: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      poNo1: {
        type: Sequelize.STRING,
      },
      poNo2: {
        type: Sequelize.STRING,
      },
      contact: {
        type: Sequelize.STRING,
      },
      contact_date: {
        type: Sequelize.DATE,
      },
      contact_check: {
        type: Sequelize.STRING,
      },
      wo: {
        type: Sequelize.STRING,
      },
      wo_date: {
        type: Sequelize.DATE,
      },
      wo_check: {
        type: Sequelize.STRING,
      },
      value: {
        type: Sequelize.INTEGER,
      },
      budget: {
        type: Sequelize.INTEGER,
      },
      address1: {
        type: Sequelize.STRING,
      },
      address2: {
        type: Sequelize.STRING,
      },
      phone1: {
        type: Sequelize.STRING,
      },
      phone2: {
        type: Sequelize.STRING,
      },
      invoice: {
        type: Sequelize.STRING,
      },
      invoice_date: {
        type: Sequelize.DATE,
      },
      invoice_check: {
        type: Sequelize.STRING,
      },
      compilation: {
        type: Sequelize.STRING,
      },
      compilation_date: {
        type: Sequelize.DATE,
      },
      compilation_check: {
        type: Sequelize.STRING,
      },
      start: {
        type: Sequelize.STRING,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      start_check: {
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
    await queryInterface.dropTable('projects');
  },
};
