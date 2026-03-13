"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Requested_Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Requested_Document.belongsTo(models.Request, {
        foreignKey: "request_id",
        as: "request",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Requested_Document.belongsTo(models.Document, {
        foreignKey: "document_id",
        as: "document",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Requested_Document.init(
    {
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "requests",
          key: "id",
        },
      },
      document_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "documents",
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
      modelName: "Requested_Document",
      tableName: "requested_documents",
      underscored: true,
      timestamps: true,
    },
  );
  return Requested_Document;
};
