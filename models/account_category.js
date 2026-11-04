'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      account_category.hasMany(models.temp_journal, {
        foreignKey: 'rkoderek', // Kolom di temp_journal
        sourceKey: 'account_code', // Kolom di account_category
      });
    }
  }
  account_category.init(
    {
      account_code: DataTypes.STRING,
      name1: DataTypes.STRING,
      name2: DataTypes.STRING,
      name3: DataTypes.STRING,
      name4: DataTypes.STRING,
      name5: DataTypes.STRING,
      level: DataTypes.INTEGER,
      group: DataTypes.STRING,
      condition: DataTypes.STRING,
      report: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'account_category',
    }
  );
  return account_category;
};
