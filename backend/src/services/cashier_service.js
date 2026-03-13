const studentRepository = require("../repositories/student_repository");
const requestRepository = require("../repositories/request_repository");
const logRepository = require("../repositories/log_repository");

async function GetStudentsForCashier() {
  const allowedStatuses = ["paid", "overdue", "invoiced"];

  const students = await studentRepository.FindAllStudents(null, {
    include: [
      {
        association: "request",
        where: {
          status: allowedStatuses,
        },
        required: true,
        include: ["documents"],
      },
    ],
  });

  return students.map((s) => s.toJSON());
}

async function UpdateRequestStatus(requestId, status, account) {
  const allowedStatuses = ["paid", "invoiced"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status for cashier");
  }

  const request = await requestRepository.FindRequestById(requestId);

  if (!request) {
    throw new Error("Request not found");
  }

  const previousStatus = request.status;

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
  GetStudentsForCashier,
  UpdateRequestStatus,
};
