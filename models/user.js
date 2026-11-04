'use strict';
const { encryptPwd } = require('../helpers/bcrypt');

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsTo(models.business_unit, {
        foreignKey: 'business_code', // Kolom di business_unit
        sourceKey: 'business_code',
      });
    }
  }
  user.init(
    {
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'User name must be unique',
        },
        validate: {
          notEmpty: {
            msg: 'User name cannot be empty',
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Name cannot be empty',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Password cannot be empty',
          },
        },
      },
      business_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Business unit cannot be empty',
          },
        },
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Level cannot be empty',
          },
          isInt: {
            msg: 'Level must be an integer',
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate(user, options) {
          user.password = encryptPwd(user.password);
        },

        beforeUpdate(user, options) {
          user.password = encryptPwd(user.password);
        },
      },
      sequelize,
      modelName: 'user',
    }
  );
  return user;
};
