"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Additional_Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Additional_Document.hasMany(models.Requested_Additional, {
        foreignKey: "additional_document_id",
        as: "requested_additionals",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Additional_Document.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
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
