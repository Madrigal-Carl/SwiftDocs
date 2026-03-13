const requestRepository = require("../repositories/request_repository");
const logRepository = require("../repositories/log_repository");

async function UpdateRequestStatus(requestId, status, account) {
  const allowedStatuses = ["invoiced", "reject", "released"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status for RMO");
  }

  const request = await requestRepository.FindRequestById(requestId);

  if (!request) {
    throw new Error("Request not found");
  }

  const previousStatus = request.status;

  if (status === "invoiced" && previousStatus !== "pending") {
    throw new Error("Only pending requests can be invoiced");
  }

  if (status === "reject" && previousStatus !== "pending") {
    throw new Error("Only pending requests can be rejected");
  }

  if (status === "released" && previousStatus !== "paid") {
    throw new Error("Request must be paid before releasing");
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

  return request;
}

module.exports = {
  UpdateRequestStatus,
};
