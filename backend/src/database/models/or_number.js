"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OR_Number extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OR_Number.hasMany(models.Receipt, {
        foreignKey: "or_number_id",
        as: "receipts",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      OR_Number.belongsTo(models.Request, {
        foreignKey: "request_id",
        as: "request",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  OR_Number.init(
    {
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "requests",
          key: "id",
        },
      },
      or_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "OR_Number",
      tableName: "or_numbers",
      underscored: true,
      timestamps: true,
    },
  );
  return OR_Number;
};
