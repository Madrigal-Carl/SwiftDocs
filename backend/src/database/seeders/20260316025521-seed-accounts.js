"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const password = await bcrypt.hash("SwiftDocs123", 10);

    await queryInterface.bulkInsert("accounts", [
      {
        first_name: "System",
        middle_name: null,
        last_name: "Administrator",
        email: "admin@gmail.com",
        password: password,
        role: "admin",
        remember_me: false,
      },
      {
        first_name: "Registrar",
        middle_name: null,
        last_name: "Officer",
        email: "rmo@gmail.com",
        password: password,
        role: "rmo",
        remember_me: false,
      },
      {
        first_name: "Cashier",
        middle_name: null,
        last_name: "Officer",
        email: "cashier@gmail.com",
        password: password,
        role: "cashier",
        remember_me: false,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("accounts", {
      email: ["admin@gmail.com", "rmo@gmail.com", "cashier@gmail.com"],
    });
  },
};
