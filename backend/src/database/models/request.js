"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Request.belongsTo(models.Student, {
        foreignKey: "student_id",
        as: "student",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Request.hasMany(models.Receipt, {
        foreignKey: "request_id",
        as: "receipts",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Request.hasMany(models.Document, {
        foreignKey: "request_id",
        as: "documents",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Request.hasMany(models.Log, {
        foreignKey: "request_id",
        as: "logs",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }

    static generateReference() {
      return `req-${nanoid(8).toLowerCase()}`;
    }
  }
  Request.init(
    {
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
      },
      reference_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      request_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM(
          "reject",
          "released",
          "pending",
          "paid",
          "overdue",
          "invoiced",
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      request_completed: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Request",
      tableName: "requests",
      underscored: true,
      timestamps: true,
      hooks: {
        beforeValidate: async (request) => {
          if (request.reference_number) return;

          let ref;
          let exists;

          do {
            ref = Request.generateReference();
            exists = await Request.findOne({
              where: { reference_number: ref },
            });
          } while (exists);

          request.reference_number = ref;
        },
      },
    },
  );
  return Request;
};
