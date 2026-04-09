const { Request, Sequelize, OR_Number } = require("../database/models");
const { Op } = Sequelize;
const requestRepository = require("../repositories/request_repository");
const logRepository = require("../repositories/log_repository");
const mailService = require("./mail_service");
const receiptRepository = require("../repositories/receipt_repository");

/**
 * Get paginated requests for cashier with filters
 */
async function GetRequestsForCashier(page = 1, limit = 10, filters = {}) {
  let { search = "", status = "" } = filters;

  const allowedStatuses = ["pending", "balance_due", "paid", "invoiced"];

  search = search.trim();
  status = status.trim();

  const where = {
    status: allowedStatuses,
  };

  if (status !== "" && allowedStatuses.includes(status)) {
    where.status = status;
  }

  if (search !== "") {
    const safeSearch = search.replace(/'/g, "''").toLowerCase();

    where[Op.or] = [
      Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("Request.reference_number")),
        { [Op.like]: `%${safeSearch}%` },
      ),
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

  const { docs, pages, total } = await Request.paginate({
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
    include: [
      {
        association: "student",
        attributes: ["id", "first_name", "middle_name", "last_name"],
        include: [
          {
            association: "education",
            attributes: ["lrn"],
          },
        ],
      },
      { association: "requested_documents", include: ["document"] },
      { association: "additional_documents" },
    ],
    distinct: true,
  });

  const result = docs.map((req) => {
    const student = req.student;

    const totalDocuments =
      req.getTotalDocumentQuantity() + req.getTotalAdditionalQuantity();

    const totalPrice = req.getGrandTotal();

    return {
      id: student.id,
      full_name: student.getFullName(),
      lrn: student.education?.lrn,
      request: {
        id: req.id,
        reference_number: req.reference_number,
        request_date: req.request_date,
        status: req.status,
        total_documents: totalDocuments,
        total_price: totalPrice,
        request_completed: req.request_completed,
        expected_release_date: req.expected_release_date,
        created_at: req.createdAt.toISOString(),
      },
    };
  });

  return {
    data: result,
    pagination: { total, pages, page, limit },
  };
}

/**
 * Update request status (cashier)
 */
async function ApprovePayment(requestId, account, note, proofPaths, orNumber) {
  const request = await requestRepository.FindRequestById(requestId, null, {
    include: [
      { association: "student" },
      { association: "requested_documents", include: ["document"] },
      { association: "additional_documents" },
      { association: "bills" },
    ],
  });

  if (!request) throw new Error("Request not found");

  if (!request.isInvoiced()) {
    throw new Error("Only invoiced requests can be marked as paid");
  }

  const existingOR = await OR_Number.findOne({
    where: {
      or_number: orNumber,
    },
  });

  if (existingOR) {
    throw new Error("OR number already exists");
  }

  const previousStatus = request.status;

  request.markInvoicedToPaid();
  await request.save();

  const orNumberInstance = await OR_Number.create({
    request_id: requestId,
    or_number: orNumber,
  });

  await receiptRepository.CreateReceipts(
    requestId,
    proofPaths,
    orNumberInstance.id,
  );

  await logRepository.CreateLog({
    account_id: account.id,
    request_id: requestId,
    role: account.role,
    action: "paid",
    from_status: previousStatus,
    to_status: request.status,
    notes: note,
  });

  await mailService.SendCashierUpdateMail({
    request: request,
    status: "paid",
    notes: note,
  });

  request.or_number = orNumber;

  return request;
}

async function UpdateToReview(requestId, status, account, note = null) {
  const request = await requestRepository.FindRequestById(requestId, null, {
    include: [{ association: "student" }],
  });

  if (!request) {
    throw new Error("Request not found");
  }

  const previousStatus = request.status;

  if (status === "under_review") {
    if (request.isPending()) {
      request.markPendingToUnderReview();
    } else if (request.isBalanceDue()) {
      request.markBalanceDueToUnderReview();
    } else {
      throw new Error(
        "Only pending or balance_due can be moved to under_review",
      );
    }
  }

  if (status === "balance_due") {
    if (request.isPending()) {
      request.markPendingToBalanceDue();
    } else {
      throw new Error("Only pending requests can be marked as balance_due");
    }
  }

  await request.save();

  await logRepository.CreateLog({
    account_id: account.id,
    request_id: requestId,
    role: account.role,
    action: status,
    from_status: previousStatus,
    to_status: request.status,
    notes: note,
  });

  const emailStatusMap = {
    under_review: "under_review",
    balance_due: "balance_due",
  };

  const emailStatus = emailStatusMap[status];

  if (emailStatus) {
    await mailService.SendCashierUpdateMail({
      request: request,
      status: emailStatus,
      notes: note,
    });
  }

  return request;
}

module.exports = {
  GetRequestsForCashier,
  ApprovePayment,
  UpdateToReview,
};
