const { Request, Sequelize, OR_Number } = require("../database/models");
const { Op } = Sequelize;
const requestRepository = require("../repositories/request_repository");
const logRepository = require("../repositories/log_repository");
const mailService = require("./mail_service");
const receiptRepository = require("../repositories/receipt_repository");

async function GetRequestsForCashier(page = 1, limit = 10, filters = {}) {
  let { search = "", status = "" } = filters;

  const allowedStatuses = ["pending", "paid", "invoiced"];

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
      { association: "validation" },
    ],
    distinct: true,
  });

  const result = docs.map((req) => {
    const student = req.student;

    const totalDocuments =
      req.getTotalDocumentQuantity() + req.getTotalAdditionalQuantity();

    const totalPrice = req.getGrandTotal();
    const isApproved = req.validation.cashier;

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
        isApproved: isApproved,
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

  await mailService.SendUpdateMail({
    request: request,
    status: "paid",
    notes: note,
  });

  request.or_number = orNumber;

  return request;
}

async function UpdateToReview(requestId, status, account, note = null) {
  const request = await requestRepository.FindRequestById(requestId, null, {
    include: [
      { association: "student" },
      { association: "requested_documents", include: ["document"] },
      { association: "additional_documents" },
      { association: "bills" },
      { association: "validation" },
    ],
  });

  if (!request) {
    throw new Error("Request not found");
  }

  const previousStatus = request.status;

  let finalStatus = request.status;
  let emailStatus = status;
  let role = account.role;
  let accountId = account.id;
  let action = status;
  let isSystemAction = false;

  if (status === "balance_due") {
    if (!request.isPending()) {
      throw new Error("Only pending requests can be marked balance_due");
    }

    if (request.validation) {
      request.validation.cashier = false;
      await request.validation.save();
    }

    finalStatus = "pending";
    action = "pending";

    emailStatus = "balance_due";
  }

  if (status === "invoiced") {
    if (!request.isPending()) {
      throw new Error("Only pending requests can be invoiced");
    }

    if (request.validation) {
      request.validation.cashier = true;
      await request.validation.save();
    }

    const approved = request.isRequestApproved();

    if (approved) {
      request.markPendingToInvoiced();

      finalStatus = "invoiced";
      action = "invoiced";

      role = "system";
      accountId = null;
      isSystemAction = true;

      emailStatus = "invoiced";
    } else {
      finalStatus = "pending";
      action = "approved_cashier";

      emailStatus = null;
    }
  }

  await request.save();

  await logRepository.CreateLog({
    account_id: accountId,
    request_id: requestId,
    role: isSystemAction ? "system" : role,
    action,
    from_status: previousStatus,
    to_status: finalStatus,
    notes: note,
  });

  if (emailStatus) {
    await mailService.SendUpdateMail({
      request,
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
