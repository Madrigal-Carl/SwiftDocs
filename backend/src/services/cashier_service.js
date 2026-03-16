const studentRepository = require("../repositories/student_repository");
const requestRepository = require("../repositories/request_repository");
const logRepository = require("../repositories/log_repository");

async function GetRequestsForCashier() {
  const allowedStatuses = ["paid", "invoiced"];

  const students = await studentRepository.FindAllStudents(null, {
    include: [
      {
        association: "request",
        where: {
          status: allowedStatuses,
        },
        required: true,
        include: [
          {
            association: "requested_documents",
            include: ["document"],
          },
          {
            association: "additional_documents",
          },
        ],
      },
    ],
  });

  return students.map((s) => s.toJSON());
}

async function UpdateRequestStatus(requestId, status, account) {
  const allowedStatuses = ["paid"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status for cashier");
  }

  const request = await requestRepository.FindRequestById(requestId);

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
  });

  return request;
}

module.exports = {
  GetRequestsForCashier,
  UpdateRequestStatus,
};
