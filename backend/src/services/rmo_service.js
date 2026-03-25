const requestRepository = require("../repositories/request_repository");
const { Request, Additional_Document } = require("../database/models");
const logRepository = require("../repositories/log_repository");
const mailService = require("./mail_service");

async function UpdateRequestStatus(
  requestId,
  status,
  account,
  note = null,
  additionalDocs = [],
) {
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

  if (status === "invoiced" && !request.isPending()) {
    throw new Error("Only pending requests can be invoiced");
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
    notes: note,
  });

  await mailService.SendRMOUpdateMail({
    request,
    status,
    reason: note,
  });

  return {
    ...request.toJSON(),
    total_price: request.getGrandTotal(),
    documents: request.getDocumentSummary(),
  };
}

async function UpdateAdditionalDocumentPrices(
  requestId,
  additionalDocs,
  account,
) {
  const request = await requestRepository.FindRequestById(requestId, null, {
    include: [
      {
        association: "additional_documents",
      },
    ],
  });

  if (!request) {
    throw new Error("Request not found");
  }

  if (!request.isPending()) {
    throw new Error("Prices can only be updated while request is pending");
  }

  for (const doc of additionalDocs) {
    const additional = request.additional_documents.find(
      (ad) => ad.id === doc.id,
    );

    if (!additional) {
      throw new Error(`Additional document ${doc.id} not found`);
    }

    additional.unit_price = doc.unit_price;
    await additional.save();
  }

  return request;
}

module.exports = {
  UpdateRequestStatus,
  UpdateAdditionalDocumentPrices,
};
