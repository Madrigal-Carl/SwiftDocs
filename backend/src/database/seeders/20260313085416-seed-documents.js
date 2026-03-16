"use strict";

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
    await queryInterface.bulkInsert("documents", [
      {
        type: "diploma (for 2nd copy, provide affidavit of loss)",
        price: 300,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "transcript of records",
        price: 500,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "true copy of grades",
        price: 200,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "form 137 (for shs only)",
        price: 200,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "form 138 (for shs only)",
        price: 200,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "honorable dismissal (with tor to be sent to the requesting school)",
        price: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "certificate of good moral",
        price: 200,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ctc (certified true copy)",
        price: 100,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "certificate of honor / awards",
        price: 250,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "course description",
        price: 200,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "certificate of grades",
        price: 200,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "wes application",
        price: 4000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "cav application",
        price: 500,
        created_at: new Date(),
        updated_at: new Date(),
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
    await queryInterface.bulkDelete("documents", null, {});
  },
};
