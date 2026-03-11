"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("education", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      lrn: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      education_level: {
        type: Sequelize.ENUM("college", "senior_high"),
        allowNull: false,
      },
      school_last_attended: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      admission_date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      completion_status: {
        type: Sequelize.ENUM("graduate", "undergraduate"),
        allowNull: false,
      },
      graduation_date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      attendance_period: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("education");
  },
};
