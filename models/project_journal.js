'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project_journal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      project_journal.belongsTo(models.transaction, {
        foreignKey: 'rreferensi',
        targetKey: 'rreferensi',
      });
      project_journal.belongsTo(models.project_transaction, {
        foreignKey: 'rreferensi',
      });
      project_journal.belongsTo(models.project, {
        foreignKey: 'rkodepro', // Kolom di journal
        targetKey: 'project_code', // Kolom di project
      });
      project_journal.belongsTo(models.external, {
        foreignKey: 'rkodeext', // Kolom di journal
        targetKey: 'external_code', // Kolom di external
      });
      project_journal.belongsTo(models.internal, {
        foreignKey: 'rkodeint', // Kolom di journal
        targetKey: 'internal_code', // Kolom di internal
      });
      project_journal.belongsTo(models.account_category, {
        foreignKey: 'rkoderek', // Kolom di journal
        targetKey: 'account_code', // Kolom di account_category
        as: 'account',
      });
      project_journal.belongsTo(models.business_unit, {
        foreignKey: 'bunit', // Kolom di journal
        targetKey: 'business_code', // Kolom di business_unit
      });
    }
  }
  project_journal.init(
    {
      rtanggal: DataTypes.DATE,
      rreferensi: DataTypes.STRING,
      rreftgl: DataTypes.DATE,
      rrefpada: DataTypes.STRING,
      rrefterang: DataTypes.STRING,
      rqty: DataTypes.INTEGER,
      runit: DataTypes.STRING,
      rprice: DataTypes.DECIMAL(15, 0),
      rkodepro: DataTypes.STRING,
      rkodeext: DataTypes.STRING,
      rkodeint: DataTypes.STRING,
      rkoderek: DataTypes.STRING,
      rkodeinv: DataTypes.STRING,
      rkodepo: DataTypes.STRING,
      rbdebet: DataTypes.DECIMAL(15, 0),
      rbkredit: DataTypes.DECIMAL(15, 0),
      rsaldo: DataTypes.DECIMAL(15, 0),
      rdebet: DataTypes.DECIMAL(15, 0),
      rkredit: DataTypes.DECIMAL(15, 0),
      redebet: DataTypes.DECIMAL(15, 0),
      rekredit: DataTypes.DECIMAL(15, 0),
      rjumlah: DataTypes.DECIMAL(15, 0),
      rkredeb: DataTypes.STRING,
      flag: {
        type: DataTypes.STRING,
        defaultValue: 'M', // Default value for flag
      },
      fdate: DataTypes.DATE,
      ftime: DataTypes.TIME,
      userid: DataTypes.STRING,
      bunit: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'project_journal',
    }
  );
  return project_journal;
};
