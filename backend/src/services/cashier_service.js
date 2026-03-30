const { Request, Sequelize, OR_Number } = require("../database/models");
const { Op } = Sequelize;
const requestRepository = require("../repositories/request_repository");
const logRepository = require("../repositories/log_repository");
const mailService = require("./mail_service");
const { computeStats } = require("../utils/stats_computation");
const receiptRepository = require("../repositories/receipt_repository");

/**
 * Get paginated requests for cashier with filters
 */
async function GetRequestsForCashier(page = 1, limit = 10, filters = {}) {
  let { search = "", status = "" } = filters;

  const allowedStatuses = ["paid", "invoiced"];

  search = search.trim();
  status = status.trim();

  const where = {
    status: allowedStatuses, // default restriction
  };

  if (status !== "" && allowedStatuses.includes(status)) {
    where.status = status;
  }

  if (search !== "") {
    const safeSearch = search.replace(/'/g, "''").toLowerCase();

    where[Op.or] = [
      Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("Request.reference_number")),
        { [Op.like]: `%${safeSearch}%` }
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

  const allRequests = await Request.findAll({
    where: { status: allowedStatuses },
    attributes: ["status", "request_date"],
  });

  const stats = computeStats(allRequests);

  const { docs, pages, total } = await Request.paginate({
    page,
    paginate: limit,
    order: [["created_at", "DESC"]],
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
        created_at: req.createdAt.toISOString(),
      },
    };
  });

  return {
    data: result,
    pagination: { total, pages, page, limit },
    stats,
  };
}

/**
 * Update request status (cashier)
 * ✅ Accepts OR number from frontend
 */
async function UpdateRequestStatus(
  requestId,
  status,
  account,
  note = null,
  proofPaths = [],
  orNumber // OR number input from frontend
) {
  const allowedStatuses = ["paid"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status for cashier");
  }

  // Fetch the request with necessary associations
  const request = await requestRepository.FindRequestById(requestId, null, {
    include: [
      { association: "student" },
      { association: "requested_documents", include: ["document"] },
      { association: "additional_documents" },
    ],
  });

  if (!request) {
    throw new Error("Request not found");
  }

  if (status === "paid" && !orNumber) {
    throw new Error("OR number is required for paid requests");
  }

  const previousStatus = request.status;

  // 1️⃣ Mark request as paid
  const actions = { paid: () => request.markPaid() };
  actions[status]();
  await request.save();

  // 2️⃣ Create OR number record first
  let orNumberInstance = null;
  if (orNumber) {
  orNumberInstance = await OR_Number.create({
    request_id: requestId,
    or_number: orNumber,
  });
  }

  // 3️⃣ Save payment proofs / receipts
  // Pass OR number ID so foreign key constraint is satisfied
  await receiptRepository.CreateReceipts(
  requestId,
  proofPaths,
  orNumberInstance.id // ✅ pass OR number ID
  );

  // 4️⃣ Log action
  await logRepository.CreateLog({
    account_id: account.id,
    request_id: requestId,
    role: account.role,
    action: status,
    from_status: previousStatus,
    to_status: request.status,
    notes: note,
  });

  // 5️⃣ Send notification email
  await mailService.SendCashierUpdateMail({ request, status });

  // Attach OR number to request object for frontend
  request.or_number = orNumber;

  return request;
}

module.exports = {
  GetRequestsForCashier,
  UpdateRequestStatus,
};