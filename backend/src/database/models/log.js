"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Log.belongsTo(models.Account, {
        foreignKey: "account_id",
        as: "account",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Log.belongsTo(models.Request, {
        foreignKey: "request_id",
        as: "request",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Log.init(
    {
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "accounts",
          key: "id",
        },
      },
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "requests",
          key: "id",
        },
      },
      role: {
        type: DataTypes.ENUM("rmo", "cashier", "system"),
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM("rejected", "released", "paid", "invoiced"),
        allowNull: false,
      },
      from_status: {
        type: DataTypes.ENUM("pending", "paid", "invoiced"),
        allowNull: false,
      },
      to_status: {
        type: DataTypes.ENUM("rejected", "released", "paid", "invoiced"),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Log",
      tableName: "logs",
      underscored: true,
      timestamps: true,
    },
  );
  return Log;
};
