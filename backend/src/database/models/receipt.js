"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Receipt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Receipt.belongsTo(models.Request, {
        foreignKey: "request_id",
        as: "request",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Receipt.init(
    {
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Request",
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
      modelName: "Receipt",
      tableName: "receipts",
      underscored: true,
      timestamps: true,
    },
  );
  return Receipt;
};
