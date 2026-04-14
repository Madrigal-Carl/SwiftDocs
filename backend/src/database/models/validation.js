"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Validation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Validation.belongsTo(models.Request, {
        foreignKey: "request_id",
        as: "request",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Validation.init(
    {
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "requests",
          key: "id",
        },
      },
      rmo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      cashier: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Validation",
      tableName: "validations",
      underscored: true,
      timestamps: true,
    },
  );
  return Validation;
};
