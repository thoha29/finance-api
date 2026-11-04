'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class temp_journal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      temp_journal.belongsTo(models.temp_transaction, {
        foreignKey: 'rreferensi',
      });
      temp_journal.belongsTo(models.project, {
        foreignKey: 'rkodepro', // Kolom di temp_journal
        targetKey: 'project_code', // Kolom di project
      });
      temp_journal.belongsTo(models.external, {
        foreignKey: 'rkodeext', // Kolom di temp_journal
        targetKey: 'external_code', // Kolom di external
      });
      temp_journal.belongsTo(models.internal, {
        foreignKey: 'rkodeint', // Kolom di temp_journal
        targetKey: 'internal_code', // Kolom di internal
      });
      temp_journal.belongsTo(models.account_category, {
        foreignKey: 'rkoderek', // Kolom di temp_journal
        targetKey: 'account_code', // Kolom di account_category
      });
      temp_journal.belongsTo(models.business_unit, {
        foreignKey: 'bunit', // Kolom di temp_journal
        targetKey: 'business_code', // Kolom di business_unit
      });
    }
  }
  temp_journal.init(
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
      modelName: 'temp_journal',
    }
  );
  return temp_journal;
};
