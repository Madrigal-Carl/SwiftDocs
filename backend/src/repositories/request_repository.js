const { Request, Bill, Sequelize } = require("../database/models");
const { Op } = Sequelize;

function CreateRequest(data, transaction) {
  return Request.create(data, { transaction });
}

function FindRequestById(id, transaction = null, options = {}) {
  return Request.findByPk(id, {
    transaction,
    ...options,
  });
}

function CreateBill(data, transaction = null) {
  return Bill.create(data, { transaction });
}

async function FindByReferenceNumber(referenceNumber, options = {}) {
  return Request.findOne({
    where: { reference_number: referenceNumber },
    ...options,
  });
}

async function GetAllRequestStatuses() {
  return Request.findAll({
    attributes: ["status", "request_date"],
    include: [
      {
        association: "requested_documents",
        include: ["document"],
      },
      {
        association: "additional_documents",
      },
    ],
  });
}

async function FetchAllRequestsWithStudent(page = 1, limit = 10, filters = {}) {
  let { search = "", status = "" } = filters;

  // ✅ Normalize inputs
  search = search.trim();
  status = status.trim();

  const where = {};

  // ✅ Apply status ONLY if not empty
  if (status !== "") {
    where.status = status;
  }

  // ✅ Apply search ONLY if not empty
  if (search !== "") {
    const safeSearch = search.replace(/'/g, "''").toLowerCase();

    where[Op.or] = [
      // 🔹 Reference number
      Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("Request.reference_number")),
        {
          [Op.like]: `%${safeSearch}%`,
        },
      ),

      // 🔹 Student first / last name
      Sequelize.literal(`
        EXISTS (
          SELECT 1 FROM students AS student
          WHERE student.id = Request.student_id
          AND (
            LOWER(student.first_name) LIKE '%${safeSearch}%'
            OR LOWER(student.last_name) LIKE '%${safeSearch}%'
          )
        )
      `),
    ];
  }

  const requestIncludes = [
    {
      association: "student",
      attributes: ["id", "first_name", "middle_name", "last_name"],
      required: false,
      include: [
        {
          association: "education",
          attributes: ["lrn"],
        },
      ],
    },
    {
      association: "requested_documents",
      include: ["document"],
    },
    {
      association: "additional_documents",
    },
  ];

  return Request.paginate({
    page,
    paginate: limit,
    order: [
      [
        Sequelize.literal(`
      CASE 
        WHEN \`Request\`.\`expected_release_date\` IS NULL THEN 1
        ELSE 0
      END
    `),
        "ASC",
      ],
      [Sequelize.col("expected_release_date"), "ASC"],
      ["created_at", "DESC"],
    ],
    where,
    include: requestIncludes,
    distinct: true,
  });
}

async function GetAllRequestStatuses() {
  return Request.findAll({
    attributes: [
      "id",
      "reference_number",
      "status",
      "request_date",
      "request_completed",
    ],
    include: [
      {
        association: "student",
        attributes: ["first_name", "middle_name", "last_name"],
      },
      {
        association: "requested_documents",
        include: ["document"],
      },
      {
        association: "additional_documents",
      },
    ],
  });
}

async function FetchStaleRequests() {
  return Request.findAll({
    where: {
      status: {
        [Op.in]: ["deficient", "balance_due"],
      },
      updated_at: {
        [Op.lte]: Sequelize.literal("DATE_SUB(NOW(), INTERVAL 3 MONTH)"),
      },
    },
    include: [
      {
        association: "student",
        attributes: ["id", "first_name", "middle_name", "last_name", "email"],
      },
    ],
  });
}

module.exports = {
  CreateRequest,
  CreateBill,
  FindRequestById,
  FindByReferenceNumber,
  GetAllRequestStatuses,
  FetchAllRequestsWithStudent,
  FetchStaleRequests,
};
