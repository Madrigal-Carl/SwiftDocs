"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Requested_Additional extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Requested_Additional.belongsTo(models.Request, {
        foreignKey: "request_id",
        as: "request",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Requested_Additional.belongsTo(models.Additional_Document, {
        foreignKey: "additional_document_id",
        as: "document",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Requested_Additional.init(
    {
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "requests",
          key: "id",
        },
      },
      additional_document_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "additional_documents",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "Requested_Additional",
      tableName: "requested_additionals",
      underscored: true,
      timestamps: true,
    },
  );
  return Requested_Additional;
};
