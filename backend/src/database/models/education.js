"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Education extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Education.belongsTo(models.Student, {
        foreignKey: "student_id",
        as: "student",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Education.hasOne(models.CollegeRecord, {
        foreignKey: "education_id",
        as: "collegeRecord",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Education.hasOne(models.SeniorHighRecord, {
        foreignKey: "education_id",
        as: "seniorHighRecord",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }

    async getRecord(options = {}) {
      if (!this.collegeRecord || !this.seniorHighRecord) {
        await this.reload({
          include: [
            { association: "collegeRecord" },
            { association: "seniorHighRecord" },
          ],
          ...options,
        });
      }

      return this.collegeRecord || this.seniorHighRecord || null;
    }
  }
  Education.init(
    {
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Students",
          key: "id",
        },
      },
      lrn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      education_level: {
        type: DataTypes.ENUM("college", "senior_high"),
        allowNull: false,
      },
      school_last_attended: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      admission_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      completion_status: {
        type: DataTypes.ENUM("graduate", "undergraduate"),
        allowNull: false,
      },
      graduation_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      attendance_period: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Education",
      underscored: true,
      timestamps: true,
    },
  );
  return Education;
};
