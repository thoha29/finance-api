'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('temp_journals', {
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
      rreftgl: {
        type: Sequelize.DATE,
      },
      rrefpada: {
        type: Sequelize.STRING,
      },
      rrefterang: {
        type: Sequelize.STRING,
      },
      rqty: {
        type: Sequelize.INTEGER,
      },
      runit: {
        type: Sequelize.STRING,
      },
      rprice: {
        type: Sequelize.DECIMAL(15, 0),
      },
      rkodepro: {
        type: Sequelize.STRING,
      },
      rkodeext: {
        type: Sequelize.STRING,
      },
      rkodeint: {
        type: Sequelize.STRING,
      },
      rkoderek: {
        type: Sequelize.STRING,
      },
      rkodeinv: {
        type: Sequelize.STRING,
      },
      rkodepo: {
        type: Sequelize.STRING,
      },
      rbdebet: {
        type: Sequelize.DECIMAL(15, 0),
      },
      rbkredit: {
        type: Sequelize.DECIMAL(15, 0),
      },
      rsaldo: {
        type: Sequelize.DECIMAL(15, 0),
      },
      rdebet: {
        type: Sequelize.DECIMAL(15, 0),
      },
      rkredit: {
        type: Sequelize.DECIMAL(15, 0),
      },
      redebet: {
        type: Sequelize.DECIMAL(15, 0),
      },
      rekredit: {
        type: Sequelize.DECIMAL(15, 0),
      },
      rjumlah: {
        type: Sequelize.DECIMAL(15, 0),
      },
      rkredeb: {
        type: Sequelize.STRING,
      },
      flag: {
        type: Sequelize.STRING,
      },
      fdate: {
        type: Sequelize.DATE,
      },
      ftime: {
        type: Sequelize.TIME,
      },
      userid: {
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
    await queryInterface.dropTable('temp_journals');
  },
};
