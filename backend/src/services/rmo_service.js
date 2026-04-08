const requestRepository = require("../repositories/request_repository");
const { Request, Additional_Document } = require("../database/models");
const logRepository = require("../repositories/log_repository");
const mailService = require("./mail_service");

async function UpdateRequestStatus(
  requestId,
  status,
  account,
  note = null,
  bills = [],
  expected_release_date = null,
) {
  const allowedStatuses = ["deficient", "invoiced", "released"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status for RMO");
  }

  const request = await requestRepository.FindRequestById(requestId, null, {
    include: [
      { association: "student" },
      { association: "requested_documents", include: ["document"] },
      { association: "additional_documents" },
      { association: "bills" },
    ],
  });

  if (!request) {
    throw new Error("Request not found");
  }

  const previousStatus = request.status;

  if (status === "deficient") {
    if (!request.isUnderReview()) {
      throw new Error("Only under_review requests can be marked deficient");
    }

    request.markUnderReviewToDeficient();
  }

  if (status === "invoiced") {
    if (request.isUnderReview()) {
      request.markUnderReviewToInvoiced();
    } else if (request.isDeficient()) {
      request.markDeficientToInvoiced();
    } else {
      throw new Error(
        "Only under_review or deficient requests can be invoiced",
      );
    }

    const validBills = (bills || []).filter(
      (b) => b.name?.trim() !== "" && b.price !== "" && b.price !== null,
    );

    if (request.delivery_method === "delivery" && validBills.length === 0) {
      throw new Error("At least one bill is required for delivery requests");
    }

    if (validBills.length > 0) {
      await Promise.all(
        validBills.map((bill) =>
          requestRepository.CreateBill({
            request_id: request.id,
            name: bill.name,
            price: bill.price,
          }),
        ),
      );
    }
    if (expected_release_date) {
      request.expected_release_date = expected_release_date;
    }
  }

  if (status === "released") {
    if (!request.isPaid()) {
      throw new Error("Only paid requests can be released");
    }

    request.markPaidToReleased();
  }

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
    request: request,
    status,
    notes: note,
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

  if (!request.isUnderReview() && !request.isDeficient()) {
    throw new Error(
      "Prices can only be updated while request is under review or deficient",
    );
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
