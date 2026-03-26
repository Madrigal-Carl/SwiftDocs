function pendingTemplate(data) {
  const fullName = data.student.getFullName();

  return {
    subject: "Document Request is Under Review",
    html: `
      <p>Dear ${fullName},</p>

      <p>Your document request with reference number 
      <strong>${data.reference_number}</strong> is currently <strong>under review</strong>.</p>

      <p>Our team is carefully checking your request details and submitted requirements. 
      You will be notified once the review process is complete.</p>

      <p>If additional information or documents are needed, we will contact you.</p>

      <p>Thank you for your patience.</p>

      <p>Sincerely,<br>Registrar Office</p>
    `,
  };
}

function invoicedTemplate(data) {
  const fullName = data.student.getFullName();
  const documents = data.getDocumentSummary();
  const total = data.getGrandTotal();

  const docList = documents
    .map((d) => `<li>${d.type} (x${d.quantity}) - ₱${d.total}</li>`)
    .join("");

  return {
    subject: "Invoice for Your Document Request",
    html: `
      <p>Dear ${fullName},</p>

      <p>Your document request with reference number 
      <strong>${data.reference_number}</strong> has been invoiced.</p>

      <p><strong>Requested Documents:</strong></p>
      <ul>
        ${docList}
      </ul>

      <p><strong>Total Amount: ₱${total}</strong></p>

      <p>Please proceed with payment so that processing may begin.</p>

      <p>Sincerely,<br>Registrar Office</p>
    `,
  };
}

function rejectedTemplate(data, reason) {
  const fullName = data.student.getFullName();

  return {
    subject: "Your Document Request Has Been Rejected",
    html: `
      <p>Dear ${fullName},</p>

      <p>We regret to inform you that your document request with reference number
      <strong>${data.reference_number}</strong> has been rejected.</p>

      <p><strong>Reason:</strong> ${reason}</p>

      <p>If you believe this decision was made in error, please contact the Registrar Office.</p>

      <p>Sincerely,<br>Registrar Office</p>
    `,
  };
}

function releasedTemplate(data) {
  const fullName = data.student.getFullName();
  const documents = data.getDocumentSummary();

  const docList = documents
    .map((d) => `<li>${d.type} (x${d.quantity})</li>`)
    .join("");

  return {
    subject: "Your Documents Are Ready for Release",
    html: `
      <p>Dear ${fullName},</p>

      <p>Your requested documents with reference number 
      <strong>${data.reference_number}</strong> have been released.</p>

      <p><strong>Released Documents:</strong></p>
      <ul>
        ${docList}
      </ul>

      <p>You may now coordinate with the Registrar Office.</p>

      <p>Sincerely,<br>Registrar Office</p>
    `,
  };
}

function paidTemplate(data) {
  const fullName = data.student.getFullName();
  const documents = data.getDocumentSummary();
  const total = data.getGrandTotal();

  const docList = documents
    .map((d) => `<li>${d.type} (x${d.quantity})</li>`)
    .join("");

  return {
    subject: "Payment Verified for Your Document Request",
    html: `
      <p>Dear ${fullName},</p>

      <p>We are pleased to inform you that your payment for the document request with reference number 
      <strong>${data.reference_number}</strong> has been successfully <strong>verified</strong>.</p>

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

module.exports = {
  invoiced: invoicedTemplate,
  rejected: rejectedTemplate,
  released: releasedTemplate,
  paid: paidTemplate,
  pending: pendingTemplate,
};
