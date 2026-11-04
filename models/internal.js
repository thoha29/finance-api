'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class internal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      internal.hasMany(models.temp_journal, {
        foreignKey: 'rkodeint', // Kolom di temp_journal
        sourceKey: 'internal_code', // Kolom di internal
      });
    }
  }
  internal.init(
    {
      internal_code: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
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
      modelName: 'internal',
    }
  );
  return internal;
};
