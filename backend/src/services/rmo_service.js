const requestRepository = require("../repositories/request_repository");
const logRepository = require("../repositories/log_repository");

async function UpdateRequestStatus(requestId, status, account) {
  const allowedStatuses = ["invoiced", "rejected", "released"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status for RMO");
  }

  const request = await requestRepository.FindRequestById(requestId, null, {
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

  if (!request) {
    throw new Error("Request not found");
  }

  switch (status) {
    case "invoiced":
      if (!request.isPending()) {
        throw new Error("Only pending requests can be invoiced");
      }
      break;

    case "rejected":
      if (!request.isPending()) {
        throw new Error("Only pending requests can be rejected");
      }
      break;

    case "released":
      if (!request.isPaid()) {
        throw new Error("Request must be paid before releasing");
      }
      break;
  }

  await requestRepository.UpdateRequestStatus(requestId, status);

  await logRepository.CreateLog({
    account_id: account.id,
    request_id: requestId,
    role: account.role,
    action: status,
    from_status: previousStatus,
    to_status: status,
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
