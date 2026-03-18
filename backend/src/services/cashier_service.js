const studentRepository = require("../repositories/student_repository");
const requestRepository = require("../repositories/request_repository");
const logRepository = require("../repositories/log_repository");
const mailService = require("./mail_service");

async function GetRequestsForCashier() {
  const allowedStatuses = ["paid", "invoiced"];

  const students = await studentRepository.FindAllStudents(null, {
    include: [
      {
        association: "education",
        attributes: ["lrn"],
      },
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

  const result = students.map((s) => {
    const reqInstance = s.request;

    const totalDocuments =
      reqInstance.getTotalDocumentQuantity() +
      reqInstance.getTotalAdditionalQuantity();

    const totalPrice = reqInstance.getGrandTotal();

    return {
      id: s.id,
      full_name: s.getFullName(),
      lrn: s.education.lrn,
      request: {
        id: reqInstance.id,
        reference_number: reqInstance.reference_number,
        request_date: reqInstance.request_date,
        status: reqInstance.status,
        total_documents: totalDocuments,
        total_price: totalPrice,
      },
    };
  });

  return result.sort(
    (a, b) =>
      new Date(b.request.request_date) - new Date(a.request.request_date),
  );
}

async function UpdateRequestStatus(requestId, status, account) {
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
