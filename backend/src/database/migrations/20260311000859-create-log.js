"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("logs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "accounts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      request_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "requests",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      role: {
        type: Sequelize.ENUM("rmo", "cashier", "system"),
        allowNull: false,
      },
      action: {
        type: Sequelize.ENUM(
          "approved_rmo",
          "approved_cashier",
          "pending",
          "rejected",
          "invoiced",
          "paid",
          "released",
        ),
        allowNull: false,
      },
      from_status: {
        type: Sequelize.ENUM("pending", "paid", "invoiced"),
        allowNull: false,
      },
      to_status: {
        type: Sequelize.ENUM(
          "pending",
          "released",
          "paid",
          "invoiced",
          "rejected",
        ),
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("logs");
  },
};
