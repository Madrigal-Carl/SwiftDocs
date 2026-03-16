const requestRepository = require("../repositories/request_repository");
const { Request, Additional_Document } = require("../database/models");
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

async function SetAdditionalDocumentPrice(requestId, additionalDocumentId, unitPrice, account) {
  if (!additionalDocumentId) {
    throw new Error("Missing additionalDocumentId in request body");
  }

  const additionalDoc = await Additional_Document.findByPk(additionalDocumentId, {
  include: [{ model: Request, as: "request" }],
  });

  if (!additionalDoc) {
    throw new Error(`Additional document with id ${additionalDocumentId} not found`);
  }

  if (additionalDoc.request_id !== Number(requestId)) {
    throw new Error("Document does not belong to this request");
  }

  additionalDoc.unit_price = unitPrice;
  await additionalDoc.save();

  return additionalDoc;
}
module.exports = {
  UpdateRequestStatus,
  SetAdditionalDocumentPrice,
};
