"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Student.hasOne(models.Education, {
        foreignKey: "student_id",
        as: "education",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Student.hasOne(models.Request, {
        foreignKey: "student_id",
        as: "request",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }

    getFullName() {
      const capitalize = (str) =>
        str
          .split(" ")
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(" ");

      const last = capitalize(this.last_name);
      const middleInitial = this.middle_name
        ? ` ${this.middle_name.charAt(0).toUpperCase()}.`
        : "";

      return `${last}, ${this.first_name}${middleInitial}`;
    }
  }
  Student.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      middle_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      suffix: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      sex: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Student",
      tableName: "students",
      underscored: true,
      timestamps: true,
    },
  );
  return Student;
};
