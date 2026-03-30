"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Requirement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Requirement.belongsTo(models.Request, {
        foreignKey: "request_id",
        as: "request",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Requirement.init(
    {
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "requests",
          key: "id",
        },
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Requirement",
      tableName: "requirements",
      underscored: true,
      timestamps: true,
    },
  );
  return Requirement;
};
