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
      Log,
      Account, // assuming you have accounts seeded
    } = require("../models");

    // Get existing documents and accounts
    const documents = await Document.findAll();
    const rmoAccount = await Account.findOne({ where: { role: "rmo" } });
    const cashierAccount = await Account.findOne({
      where: { role: "cashier" },
    });

    if (!documents.length) throw new Error("Please seed documents first.");
    if (!rmoAccount) throw new Error("Please seed an RMO account first.");
    if (!cashierAccount)
      throw new Error("Please seed a Cashier account first.");

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
      const status = faker.helpers.arrayElement([
        "pending",
        "invoiced",
        "paid",
        "released",
        "rejected",
      ]);

      const request = await Request.create({
        student_id: student.id,
        status,
        request_date: faker.date.recent(),
        notes: faker.lorem.sentence(),
      });

      // 4️⃣ Requested Documents
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

      // 5️⃣ Additional Documents
      const additionalCount = faker.number.int({ min: 0, max: 2 });

      for (let j = 0; j < additionalCount; j++) {
        await Additional_Document.create({
          request_id: request.id,
          type: faker.commerce.productName(),
          quantity: faker.number.int({ min: 1, max: 3 }),
          unit_price: faker.number.int({ min: 50, max: 1000 }),
        });
      }

      // 6️⃣ Create Logs based on status
      const logs = [];

      switch (status) {
        case "pending":
          // No logs
          break;
        case "invoiced":
          logs.push({
            account_id: rmoAccount.id,
            request_id: request.id,
            role: "rmo",
            action: "invoiced",
            from_status: "pending",
            to_status: "invoiced",
            notes: request.notes,
            created_at: new Date(),
            updated_at: new Date(),
          });
          break;
        case "paid":
          // 1️⃣ invoiced by RMO, 2️⃣ paid by Cashier
          logs.push(
            {
              account_id: rmoAccount.id,
              request_id: request.id,
              role: "rmo",
              action: "invoiced",
              from_status: "pending",
              to_status: "invoiced",
              notes: request.notes,
              created_at: new Date(),
              updated_at: new Date(),
            },
            {
              account_id: cashierAccount.id,
              request_id: request.id,
              role: "cashier",
              action: "paid",
              from_status: "invoiced",
              to_status: "paid",
              notes: request.notes,
              created_at: new Date(),
              updated_at: new Date(),
            },
          );
          break;
        case "released":
          // 1️⃣ invoiced by RMO, 2️⃣ paid by Cashier, 3️⃣ released by RMO
          logs.push(
            {
              account_id: rmoAccount.id,
              request_id: request.id,
              role: "rmo",
              action: "invoiced",
              from_status: "pending",
              to_status: "invoiced",
              notes: request.notes,
              created_at: new Date(),
              updated_at: new Date(),
            },
            {
              account_id: cashierAccount.id,
              request_id: request.id,
              role: "cashier",
              action: "paid",
              from_status: "invoiced",
              to_status: "paid",
              notes: request.notes,
              created_at: new Date(),
              updated_at: new Date(),
            },
            {
              account_id: rmoAccount.id,
              request_id: request.id,
              role: "rmo",
              action: "released",
              from_status: "paid",
              to_status: "released",
              notes: request.notes,
              created_at: new Date(),
              updated_at: new Date(),
            },
          );
          break;
        case "rejected":
          logs.push({
            account_id: rmoAccount.id,
            request_id: request.id,
            role: "rmo",
            action: "rejected",
            from_status: "pending",
            to_status: "rejected",
            notes: request.notes,
            created_at: new Date(),
            updated_at: new Date(),
          });
          break;
      }

      if (logs.length > 0) {
        await Log.bulkCreate(logs);
      }
    }
  },

  async down(queryInterface, Sequelize) {},
};
