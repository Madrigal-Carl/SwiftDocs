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
      // define association here
    }

    static generateReference() {
      return `REQ-${nanoid(6).toUpperCase()}`;
    }
  }
  Request.init(
    {
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Students",
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
      underscored: true,
      timestamps: true,
      hooks: {
        beforeCreate: async (request) => {
          if (!request.reference_number) {
            let unique = false;

            while (!unique) {
              const ref = Request.generateReference();

              const exists = await Request.findOne({
                where: { reference_number: ref },
              });

              if (!exists) {
                request.reference_number = ref;
                unique = true;
              }
            }
          }
        },
      },
    },
  );
  return Request;
};
