'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class opening_balance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      opening_balance.hasMany(models.journal, {
        foreignKey: 'rreferensi',
      });

      opening_balance.belongsTo(models.business_unit, {
        foreignKey: 'bunit', // Kolom di opening_balance
        targetKey: 'business_code', // Kolom di business_unit
      });
    }
  }
  opening_balance.init(
    {
      rtanggal: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true, // Memastikan nilai adalah tanggal yang valid
        },
      },
      rreferensi: DataTypes.STRING,
      rterang: DataTypes.STRING,
      rjumlah: {
        type: DataTypes.DECIMAL(15, 0), // DECIMAL dengan 15 digit, tanpa koma
        allowNull: false,
        validate: {
          isNumeric: true, // Memastikan input adalah angka
          min: 0, // Tidak boleh negatif
        },
      },
      flag: {
        type: DataTypes.STRING,
        defaultValue: 'P', // Default value for flag
      },
      flagpost: {
        type: DataTypes.STRING,
        defaultValue: 'P', // Default value for flagpost
      },
      bunit: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'opening_balance',
    }
  );
  return opening_balance;
};
