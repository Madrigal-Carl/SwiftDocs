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
    } = require("../models");

    const documents = await Document.findAll();
    const rmoAccount = await Account.findOne({ where: { role: "rmo" } });
    const cashierAccount = await Account.findOne({
      where: { role: "cashier" },
    });

    for (let i = 0; i < 30; i++) {
      // ------------------------
      // 1. Student
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
      // 2. Status
      // ------------------------
      const status = faker.helpers.arrayElement([
        "pending",
        "balance_due",
        "under_review",
        "deficient",
        "invoiced",
        "paid",
        "released",
      ]);

      const currentYear = new Date().getFullYear();
      const requestDate = faker.date
        .between({
          from: new Date(`${currentYear}-01-01`),
          to: new Date(),
        })
        .toISOString()
        .split("T")[0];
      const hasExpectedRelease = ["invoiced", "paid", "released"].includes(
        status,
      );
      const expectedRelease = hasExpectedRelease
        ? faker.date.soon({
            days: 10,
            refDate: requestDate,
          })
        : null;

      const requestCompleted =
        status === "released"
          ? faker.date.between({ from: requestDate, to: expectedRelease })
          : null;

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
      // 3. Requested Documents
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
      // 4. Additional Docs
      // ------------------------
      const additionalCount = faker.number.int({ min: 0, max: 2 });

      for (let j = 0; j < additionalCount; j++) {
        await Additional_Document.create({
          request_id: request.id,
          type: faker.commerce.productName(),
          quantity: faker.number.int({ min: 1, max: 3 }),
          unit_price:
            status === "pending" ? 0 : faker.number.int({ min: 50, max: 500 }),
        });
      }

      // ------------------------
      // 5. Bills (ONLY invoiced+)
      // ------------------------
      if (["invoiced", "paid", "released"].includes(status)) {
        const billCount = faker.number.int({ min: 0, max: 3 });

        for (let b = 0; b < billCount; b++) {
          await Bill.create({
            request_id: request.id,
            name: faker.commerce.productName() + "-" + faker.string.uuid(),
            price: faker.number.int({ min: 100, max: 1000 }),
          });
        }
      }

      // ------------------------
      // 6. LOG FLOW (FULL PATH)
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

      // simulate real flow
      switch (status) {
        case "balance_due":
          addLog("pending", "balance_due", "cashier", cashierAccount);
          break;

        case "under_review":
          if (faker.datatype.boolean()) {
            addLog("pending", "balance_due", "cashier", cashierAccount);
            addLog("balance_due", "under_review", "cashier", cashierAccount);
          } else {
            addLog("pending", "under_review", "cashier", cashierAccount);
          }
          break;

        case "deficient":
          addLog("pending", "under_review", "cashier", cashierAccount);
          addLog("under_review", "deficient", "rmo", rmoAccount);
          break;

        case "invoiced":
          addLog("pending", "under_review", "cashier", cashierAccount);

          if (faker.datatype.boolean()) {
            addLog("under_review", "deficient", "rmo", rmoAccount);
            addLog("deficient", "invoiced", "rmo", rmoAccount);
          } else {
            addLog("under_review", "invoiced", "rmo", rmoAccount);
          }
          break;

        case "paid":
          addLog("pending", "under_review", "cashier", cashierAccount);
          addLog("under_review", "invoiced", "rmo", rmoAccount);
          addLog("invoiced", "paid", "cashier", cashierAccount);
          break;

        case "released":
          addLog("pending", "under_review", "cashier", cashierAccount);
          addLog("under_review", "invoiced", "rmo", rmoAccount);
          addLog("invoiced", "paid", "cashier", cashierAccount);
          addLog("paid", "released", "rmo", rmoAccount);
          break;
      }

      if (logs.length) await Log.bulkCreate(logs);

      // ------------------------
      // 7. Receipts
      // ------------------------
      if (["paid", "released"].includes(status)) {
        const orNumber = await OR_Number.create({
          request_id: request.id,
          or_number: `OR-${faker.string.numeric(8)}`,
        });

        const receipts = Array.from({
          length: faker.number.int({ min: 1, max: 3 }),
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

  async down(queryInterface, Sequelize) {},
};
