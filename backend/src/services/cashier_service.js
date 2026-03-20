const { Request } = require("../database/models");
const requestRepository = require("../repositories/request_repository");
const logRepository = require("../repositories/log_repository");
const mailService = require("./mail_service");
const { computeStats } = require("../utils/stats_computation");

async function GetRequestsForCashier(page = 1, limit = 10) {
  const allowedStatuses = ["paid", "invoiced"];

  const allRequests = await Request.findAll({
    where: { status: allowedStatuses },
    attributes: ["status", "request_date"],
  });

  const stats = computeStats(allRequests);

  const { docs, pages, total } = await Request.paginate({
    page,
    paginate: limit,
    order: [["request_date", "DESC"]],
    where: {
      status: allowedStatuses,
    },
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
      {
        association: "requested_documents",
        include: ["document"],
      },
      {
        association: "additional_documents",
      },
    ],
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
      },
    };
  });

  return {
    data: result,
    pagination: {
      total,
      pages,
      page,
      limit,
    },
    stats,
  };
}

async function UpdateRequestStatus(requestId, status, account, note = null) {
  const allowedStatuses = ["paid"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status for cashier");
  }

  const request = await requestRepository.FindRequestById(requestId, null, {
    include: [
      { association: "student" },
      {
        association: "requested_documents",
        include: ["document"],
      },
      {
        association: "additional_documents",
      },
    ],
  });

  if (!request) {
    throw new Error("Request not found");
  }

  const previousStatus = request.status;

  const actions = {
    paid: () => request.markPaid(),
  };

  actions[status]();

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

  await mailService.SendCashierUpdateMail({
    request,
    status,
  });

  return request;
}

module.exports = {
  GetRequestsForCashier,
  UpdateRequestStatus,
};
