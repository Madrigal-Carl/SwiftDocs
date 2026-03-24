"use strict";
const { Model } = require("sequelize");
const sequelizePaginate = require("sequelize-paginate");

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Document.hasMany(models.Requested_Document, {
        foreignKey: "document_id",
        as: "requested_documents",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Document.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      price: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Document",
      tableName: "documents",
      paranoid: true,
      underscored: true,
      timestamps: true,
    },
  );
  sequelizePaginate.paginate(Document);

  return Document;
};
