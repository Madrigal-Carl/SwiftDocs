"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Special_Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Special_Order.belongsTo(models.Request, {
        foreignKey: "request_id",
        as: "requests",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Special_Order.init(
    {
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "requests",
          key: "id",
        },
      },
      so_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Special_Order",
      tableName: "special_orders",
      underscored: true,
      timestamps: true,
    },
  );
  return Special_Order;
};
