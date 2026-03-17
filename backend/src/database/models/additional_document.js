"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Additional_Document extends Model {
    static associate(models) {
      Additional_Document.belongsTo(models.Request, {
        foreignKey: "request_id",
        as: "request",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Additional_Document.init(
    {
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "requests",
          key: "id",
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      },
      unit_price: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Additional_Document",
      tableName: "additional_documents",
      underscored: true,
      timestamps: true,
    },
  );

  return Additional_Document;
};
