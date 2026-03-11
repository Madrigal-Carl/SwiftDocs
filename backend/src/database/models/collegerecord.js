"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CollegeRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CollegeRecord.belongsTo(models.Education, {
        foreignKey: "education_id",
        as: "education",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  CollegeRecord.init(
    {
      education_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Education",
          key: "id",
        },
      },
      course: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CollegeRecord",
      underscored: true,
      timestamps: true,
    },
  );
  return CollegeRecord;
};
