"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const {
      Student,
      Education,
      Request,
      Requested_Document,
      Additional_Document,
      Document,
    } = require("../models");

    // Get existing documents
    const documents = await Document.findAll();

    if (!documents.length) {
      throw new Error("Please seed documents first.");
    }

    for (let i = 0; i < 30; i++) {
      // 1️⃣ Create Student
      const student = await Student.create({
        first_name: faker.person.firstName(),
        middle_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        birth_date: faker.date.birthdate({ min: 18, max: 30, mode: "age" }),
        sex: faker.helpers.arrayElement(["male", "female"]),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
        phone_number: faker.phone.number(),
      });

      // 2️⃣ Create Education
      await Education.create({
        student_id: student.id,
        lrn: faker.string.numeric(12),
        education_level: faker.helpers.arrayElement(["college", "senior_high"]),
        program: faker.person.jobArea(),
        school_last_attended: faker.company.name(),
        admission_date: faker.date.past().toISOString().split("T")[0],
        completion_status: faker.helpers.arrayElement([
          "graduate",
          "undergraduate",
        ]),
        graduation_date: faker.date.past().toISOString().split("T")[0],
        attendance_period: "2020-2024",
      });

      // 3️⃣ Create Request
      const request = await Request.create({
        student_id: student.id,
        status: faker.helpers.arrayElement([
          "pending",
          "invoiced",
          "paid",
          "released",
          "rejected",
        ]),
        request_date: faker.date.recent(),
        notes: faker.lorem.sentence(),
      });

      // 4️⃣ Create Requested Documents (1–3)
      const randomDocs = faker.helpers.arrayElements(
        documents,
        faker.number.int({ min: 1, max: 3 }),
      );

      for (const doc of randomDocs) {
        await Requested_Document.create({
          request_id: request.id,
          document_id: doc.id,
          quantity: faker.number.int({ min: 1, max: 5 }),
        });
      }

      // 5️⃣ Create Additional Documents (0–2)
      const additionalCount = faker.number.int({ min: 0, max: 2 });

      for (let j = 0; j < additionalCount; j++) {
        await Additional_Document.create({
          request_id: request.id,
          type: faker.commerce.productName(),
          quantity: faker.number.int({ min: 1, max: 3 }),
          unit_price: faker.number.int({ min: 50, max: 1000 }),
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const { Request, Student, Education } = require("../models");

    await queryInterface.bulkDelete("additional_documents", null, {});
    await queryInterface.bulkDelete("requested_documents", null, {});
    await queryInterface.bulkDelete("requests", null, {});
    await queryInterface.bulkDelete("education", null, {});
    await queryInterface.bulkDelete("students", null, {});
  },
};
