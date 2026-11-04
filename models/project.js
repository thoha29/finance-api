'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      project.hasMany(models.temp_journal, {
        foreignKey: 'rkodepro', // Kolom di temp_journal
        sourceKey: 'project_code',
      });
    }
  }
  project.init(
    {
      project_code: DataTypes.STRING,
      name: DataTypes.STRING,
      key_person_id: DataTypes.STRING,
      customer_id: DataTypes.STRING,
      description: DataTypes.STRING,
      contact: DataTypes.STRING,
      contact_date: DataTypes.DATE,
      contact_check: DataTypes.STRING,
      wo: DataTypes.STRING,
      wo_date: DataTypes.DATE,
      wo_check: DataTypes.STRING,
      value: DataTypes.INTEGER,
      budget: DataTypes.INTEGER,
      address1: DataTypes.STRING,
      address2: DataTypes.STRING,
      phone1: DataTypes.STRING,
      phone2: DataTypes.STRING,
      invoice: DataTypes.STRING,
      invoice_date: DataTypes.DATE,
      invoice_check: DataTypes.STRING,
      compilation: DataTypes.STRING,
      compilation_date: DataTypes.DATE,
      compilation_check: DataTypes.STRING,
      start: DataTypes.STRING,
      start_date: DataTypes.DATE,
      start_check: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'project',
    }
  );
  return project;
};
