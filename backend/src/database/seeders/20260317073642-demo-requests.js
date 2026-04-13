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
      Account,
      Receipt,
      OR_Number,
      Bill,
      Validation,
    } = require("../models");

    const documents = await Document.findAll();
    const rmoAccount = await Account.findOne({ where: { role: "rmo" } });
    const cashierAccount = await Account.findOne({
      where: { role: "cashier" },
    });

    for (let i = 0; i < 100; i++) {
      // ------------------------
      // 1. STUDENT
      // ------------------------
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

      // ------------------------
      // 2. STATUS (NEW FLOW ONLY)
      // ------------------------
      const status = faker.helpers.arrayElement([
        "pending",
        "invoiced",
        "paid",
        "released",
        "rejected",
      ]);

      const isRejected = status === "rejected";
      const isBilling = ["invoiced", "paid", "released"].includes(status);
      const isReleased = status === "released";

      const requestDate = faker.date
        .recent({ days: 60 })
        .toISOString()
        .split("T")[0];

      let expectedRelease = null;
      let requestCompleted = null;

      if (!isRejected && isBilling) {
        expectedRelease = faker.date.soon({ days: 7 });
      }

      if (isReleased) {
        requestCompleted = faker.date.recent({ days: 3 });
      }

      // ------------------------
      // 3. REQUEST
      // ------------------------
      const request = await Request.create({
        student_id: student.id,
        purpose: faker.lorem.sentence(),
        delivery_method: faker.helpers.arrayElement(["pickup", "delivery"]),
        status,
        request_date: requestDate,
        expected_release_date: expectedRelease,
        request_completed: requestCompleted,
        notes: faker.lorem.sentence(),
      });

      // ------------------------
      // 4. VALIDATION (IMPORTANT)
      // ------------------------
      await Validation.create({
        request_id: request.id,
        rmo:
          status !== "pending" && status !== "rejected"
            ? faker.datatype.boolean({ probability: 0.9 })
            : false,
        cashier:
          status !== "pending" && status !== "rejected"
            ? faker.datatype.boolean({ probability: 0.9 })
            : false,
      });

      // ------------------------
      // 5. REQUESTED DOCUMENTS
      // ------------------------
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

      // ------------------------
      // 6. ADDITIONAL DOCUMENTS
      // ------------------------
      const additionalCount = faker.number.int({ min: 0, max: 2 });

      for (let j = 0; j < additionalCount; j++) {
        await Additional_Document.create({
          request_id: request.id,
          type: faker.commerce.productName(),
          quantity: faker.number.int({ min: 1, max: 3 }),
          unit_price: isBilling ? faker.number.int({ min: 50, max: 500 }) : 0,
        });
      }

      // ------------------------
      // 7. BILLS
      // ------------------------
      if (isBilling) {
        const billCount = faker.number.int({ min: 1, max: 3 });

        for (let b = 0; b < billCount; b++) {
          await Bill.create({
            request_id: request.id,
            name: faker.commerce.productName(),
            price: faker.number.int({ min: 100, max: 1000 }),
          });
        }
      }

      // ------------------------
      // 8. LOGS (NEW FLOW)
      // ------------------------
      const logs = [];

      const addLog = (from, to, role, account) => {
        logs.push({
          account_id: account.id,
          request_id: request.id,
          role,
          action: to,
          from_status: from,
          to_status: to,
          notes: request.notes,
          created_at: new Date(),
          updated_at: new Date(),
        });
      };

      if (!isRejected) {
        if (["invoiced", "paid", "released"].includes(status)) {
          addLog("pending", "invoiced", "rmo", rmoAccount);
        }

        if (["paid", "released"].includes(status)) {
          addLog("invoiced", "paid", "cashier", cashierAccount);
        }

        if (status === "released") {
          addLog("paid", "released", "rmo", rmoAccount);
        }
      }

      if (logs.length) await Log.bulkCreate(logs);

      // ------------------------
      // 9. RECEIPTS
      // ------------------------
      if (["paid", "released"].includes(status)) {
        const orNumber = await OR_Number.create({
          request_id: request.id,
          or_number: `OR-${faker.string.numeric(8)}`,
        });

        const receipts = Array.from({
          length: faker.number.int({ min: 1, max: 2 }),
        }).map(() => ({
          request_id: request.id,
          or_number_id: orNumber.id,
          path: "uploads/proofs/payment_sample.jpg",
          created_at: new Date(),
          updated_at: new Date(),
        }));

        await Receipt.bulkCreate(receipts);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // optional cleanup
  },
};
