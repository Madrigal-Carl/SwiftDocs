const requestRepository = require("../repositories/request_repository");
const logRepository = require("../repositories/log_repository");
const mailService = require("./mail_service");

async function UpdateRequestStatus(requestId, status, account, note = null) {
  const allowedStatuses = ["invoiced", "rejected", "released"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status for RMO");
  }

  const request = await requestRepository.FindRequestById(requestId, null, {
    include: [
      {
        association: "student",
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

  if (!request) {
    throw new Error("Request not found");
  }

  const previousStatus = request.status;

  const actions = {
    invoiced: () => request.markInvoiced(),
    rejected: () => request.markRejected(),
    released: () => request.markReleased(),
  };

  if (!actions[status]) {
    throw new Error("Invalid status");
  }

  actions[status]();

  await request.save();

  await logRepository.CreateLog({
    account_id: account.id,
    request_id: requestId,
    role: account.role,
    action: status,
    from_status: previousStatus,
    to_status: request.status,
  });

  await mailService.SendRMOUpdateMail({
    request,
    status,
    reason: status === "rejected" ? note : null,
  });

  return {
    ...request.toJSON(),
    total_price: request.getGrandTotal(),
    documents: request.getDocumentSummary(),
  };
}

module.exports = {
  UpdateRequestStatus,
};
