'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class external extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      external.hasMany(models.temp_journal, {
        foreignKey: 'rkodeext', // Kolom di temp_journal
        sourceKey: 'external_code', // Kolom di external
      });
    }
  }
  external.init(
    {
      external_code: DataTypes.STRING,
      name: DataTypes.STRING,
      npwp: DataTypes.STRING,
      contact_name: DataTypes.STRING,
      contact_title: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state_or_province: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      country: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      fax: DataTypes.STRING,
      payment_terms: DataTypes.STRING,
      notes: DataTypes.STRING,
      flag: DataTypes.STRING,
      segment_type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'external',
    }
  );
  return external;
};
