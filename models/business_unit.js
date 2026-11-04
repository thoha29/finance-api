'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class business_unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      business_unit.hasMany(models.temp_journal, {
        foreignKey: 'bunit', // Kolom di temp_journal
        sourceKey: 'business_code', // Kolom di business_unit
      });
      business_unit.hasMany(models.user, {
        foreignKey: 'business_code', // Kolom di user
        sourceKey: 'business_code', // Kolom di business_unit
      });
      business_unit.hasMany(models.temp_transaction, {
        foreignKey: 'bunit', // Kolom di temp_transaction
        sourceKey: 'business_code', // Kolom di business_unit
      });
      business_unit.hasMany(models.transaction, {
        foreignKey: 'bunit', // Kolom di transaction
        sourceKey: 'business_code', // Kolom di business_unit
      });
      business_unit.hasMany(models.project_transaction, {
        foreignKey: 'bunit', // Kolom di project_transaction
        sourceKey: 'business_code', // Kolom di business_unit
      });
      business_unit.hasMany(models.opening_balance, {
        foreignKey: 'bunit', // Kolom di opening_balance
        sourceKey: 'business_code', // Kolom di business_unit
      });
    }
  }
  business_unit.init(
    {
      business_code: DataTypes.STRING,
      name: DataTypes.STRING,
      contact_person: DataTypes.STRING,
      title: DataTypes.STRING,
      extension: DataTypes.STRING,
      work_phone: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state_or_province: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      country: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'business_unit',
    }
  );
  return business_unit;
};
