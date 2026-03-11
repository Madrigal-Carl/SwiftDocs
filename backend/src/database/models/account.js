"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Account.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "cashier", "rmo"),
        allowNull: false,
      },
      remember_me: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
    },
    {
      sequelize,
      modelName: "Account",
      modelName: "accounts",
      underscored: true,
      timestamps: true,
    },
  );
  return Account;
};
