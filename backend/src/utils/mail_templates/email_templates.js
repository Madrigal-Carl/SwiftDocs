function pendingTemplate(data) {
  const fullName = data.request.student.getFullName();

  return {
    subject: "Document Request Submitted Successfully",
    html: `
      <p>Dear ${fullName},</p>

      <p>Your document request with reference number 
      <strong>${data.request.reference_number}</strong> has been <strong>successfully submitted</strong>.</p>

      <p>Our team has received your request and it will be processed shortly.</p>

      <p>You will be notified once your request moves to the next stage.</p>

      <p>Thank you for using our service.</p>

      <p>Sincerely,<br>Registrar Office</p>
    `,
  };
}

function balanceDueTemplate(data) {
  const fullName = data.request.student.getFullName();

  return {
    subject: "Outstanding Balance for Your Request",
    html: `
      <p>Dear ${fullName},</p>

      <p>Your document request with reference number 
      <strong>${data.request.reference_number}</strong> currently has an <strong>outstanding balance</strong>.</p>

      ${data.notes ? `<p><strong>Details:</strong> ${data.notes}</p>` : ""}

      <p>Please settle the remaining balance so that your request can proceed.</p>

      <p>If you have already made a payment, kindly disregard this message or contact us.</p>

      <p>Sincerely,<br>Registrar Office</p>
    `,
  };
}

function underReviewTemplate(data) {
  const fullName = data.request.student.getFullName();

  return {
    subject: "Your Request is Under Review",
    html: `
      <p>Dear ${fullName},</p>

      <p>Your document request with reference number 
      <strong>${data.request.reference_number}</strong> is currently <strong>under review</strong>.</p>

      <p>Our team is reviewing your submitted information and requirements.</p>

      <p>You will be notified once the review process is complete.</p>

      <p>Thank you for your patience.</p>

      <p>Sincerely,<br>Registrar Office</p>
    `,
  };
}

function deficientTemplate(data) {
  const fullName = data.request.student.getFullName();

  return {
    subject: "Additional Requirements Needed",
    html: `
      <p>Dear ${fullName},</p>

      <p>Your document request with reference number 
      <strong>${data.request.reference_number}</strong> is currently marked as <strong>deficient</strong>.</p>

      <p>To proceed, please provide the following required documents or information:</p>

      ${data.notes ? `<p><strong>Required:</strong> ${data.notes}</p>` : ""}

      <p>Once completed, your request will continue processing.</p>

      <p>If you have questions, feel free to contact us.</p>

      <p>Sincerely,<br>Registrar Office</p>
    `,
  };
}

function invoicedTemplate(data) {
  const req = data.request;

  const fullName = req.student.getFullName();
  const documents = req.getDocumentSummary();
  const total = req.getGrandTotal();

  const docList = documents
    .map((d) => `<li>${d.type} (x${d.quantity}) - ₱${d.total}</li>`)
    .join("");

  return {
    subject: "Invoice for Your Document Request",
    html: `
      <p>Dear ${fullName},</p>

      <p>Your document request with reference number 
      <strong>${req.reference_number}</strong> has been invoiced.</p>

      <p><strong>Requested Documents:</strong></p>
      <ul>${docList}</ul>

      <p><strong>Total Amount: ₱${total}</strong></p>

      <p>Please proceed with payment so that processing may begin.</p>

      <p>Sincerely,<br>Registrar Office</p>
    `,
  };
}

function paidTemplate(data) {
  const req = data.request;

  const fullName = req.student.getFullName();
  const documents = req.getDocumentSummary();
  const total = req.getGrandTotal();

  const docList = documents
    .map((d) => `<li>${d.type} (x${d.quantity})</li>`)
    .join("");

  return {
    subject: "Payment Verified for Your Document Request",
    html: `
      <p>Dear ${fullName},</p>

      <p>We are pleased to inform you that your payment for the document request with reference number 
      <strong>${req.reference_number}</strong> has been successfully <strong>verified</strong>.</p>

      <p><strong>Requested Documents:</strong></p>
      <ul>
        ${docList}
      </ul>

      <p><strong>Total Paid: ₱${total}</strong></p>

      <p>Your request will now proceed to the processing stage. You will be notified once your documents are ready for release.</p>

      <p>Sincerely,<br>Registrar Office</p>
    `,
  };
}

function releasedTemplate(data) {
  const req = data.request;

  const fullName = req.student.getFullName();
  const documents = req.getDocumentSummary();

  const docList = documents
    .map((d) => `<li>${d.type} (x${d.quantity ?? 1})</li>`)
    .join("");

  const deliveryParagraph =
    req.delivery_method === "delivery"
      ? `<p>We will deliver your documents to your address: ${req.student.address}</p>`
      : `<p>You may now coordinate with the Registrar Office to receive your documents.</p>`;

  return {
    subject: "Your Documents Are Ready for Release",
    html: `
      <p>Dear ${fullName},</p>

      <p>Your requested documents with reference number 
      <strong>${req.reference_number}</strong> have been <strong>released</strong>.</p>

      <p><strong>Released Documents:</strong></p>
      <ul>
        ${docList}
      </ul>

      ${deliveryParagraph}

      <p>We would greatly appreciate your feedback on our service to help us improve.</p>

      <p>Thank you for choosing our office.</p>

      <p>Sincerely,<br>Registrar Office</p>
    `,
  };
}

function rejectedTemplate(data) {
  const fullName = data.request.student.getFullName();

  return {
    subject: "Your Document Request Has Been Rejected",
    html: `
      <p>Dear ${fullName},</p>

      <p>We regret to inform you that your document request with reference number
      <strong>${data.request.reference_number}</strong> has been <strong>rejected</strong>.</p>

      <p>This decision was made because the request was not processed or completed within the allowable timeframe.</p>

      <p>If you still wish to proceed, you may submit a new request or contact the Registrar Office for assistance.</p>

      <p>If you believe this decision was made in error, please feel free to reach out to us.</p>

      <p>Sincerely,<br>Registrar Office</p>
    `,
  };
}

module.exports = {
  pending: pendingTemplate,
  balance_due: balanceDueTemplate,
  under_review: underReviewTemplate,
  deficient: deficientTemplate,
  invoiced: invoicedTemplate,
  paid: paidTemplate,
  released: releasedTemplate,
  rejected: rejectedTemplate,
};
