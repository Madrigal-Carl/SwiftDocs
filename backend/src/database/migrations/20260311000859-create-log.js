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
        allowNull: false,
        references: {
          model: "accounts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
        type: Sequelize.ENUM("rmo", "cashier"),
        allowNull: false,
      },
      action: {
        type: Sequelize.ENUM(
          "released",
          "paid",
          "invoiced",
          "deficient",
          "under_review",
          "balance_due",
        ),
        allowNull: false,
      },
      from_status: {
        type: Sequelize.ENUM(
          "pending",
          "paid",
          "invoiced",
          "deficient",
          "under_review",
          "balance_due",
        ),
        allowNull: false,
      },
      to_status: {
        type: Sequelize.ENUM(
          "released",
          "paid",
          "invoiced",
          "deficient",
          "under_review",
          "balance_due",
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
