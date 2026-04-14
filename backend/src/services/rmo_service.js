const requestRepository = require("../repositories/request_repository");
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
      { association: "validation" },
    ],
  });

  if (!request) {
    throw new Error("Request not found");
  }

  const previousStatus = request.status;

  let finalStatus = request.status;
  let emailStatus = status;
  let role = account.role;
  let accountId = account.id;
  let action = status;
  let isSystemAction = false;

  let approved = request.isRequestApproved();

  if (status === "deficient") {
    if (!request.isPending()) {
      throw new Error("Only pending requests can be marked deficient");
    }

    if (request.validation) {
      request.validation.rmo = false;
      await request.validation.save();

      await request.reload({
        include: [{ association: "validation" }],
      });

      approved = request.isRequestApproved();
    }

    finalStatus = "pending";
    action = "pending";

    emailStatus = "deficient";
  }

  if (status === "invoiced") {
    if (!request.isPending()) {
      throw new Error("Only pending requests can be invoiced");
    }

    if (request.validation) {
      request.validation.rmo = true;
      await request.validation.save();

      await request.reload({
        include: [{ association: "validation" }],
      });

      approved = request.isRequestApproved();
    }

    if (approved) {
      request.markPendingToInvoiced();
      finalStatus = "invoiced";
      action = "invoiced";

      role = "system";
      accountId = null;
      isSystemAction = true;
    } else {
      finalStatus = "pending";
      action = "approved_rmo";
    }

    const validBills = (bills || []).filter(
      (b) => b.name?.trim() !== "" && b.price !== "" && b.price !== null,
    );

    if (
      approved &&
      request.delivery_method === "delivery" &&
      validBills.length === 0
    ) {
      throw new Error("At least one bill is required for delivery requests");
    }

    if (approved && validBills.length > 0) {
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

    if (approved && expected_release_date) {
      request.expected_release_date = expected_release_date;
    }
  }

  if (status === "released") {
    if (!request.isPaid()) {
      throw new Error("Only paid requests can be released");
    }

    request.markPaidToReleased();
    finalStatus = "released";
  }

  await request.save();

  await logRepository.CreateLog({
    account_id: accountId,
    request_id: requestId,
    role: isSystemAction ? "system" : role,
    action,
    from_status: previousStatus,
    to_status: finalStatus,
    notes: note,
  });

  const shouldSendEmail = !(status === "invoiced" && !approved);

  if (shouldSendEmail) {
    await mailService.SendUpdateMail({
      request,
      status: emailStatus,
      notes: note,
    });
  }

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
