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

module.exports = {
  invoiced: invoicedTemplate,
  rejected: rejectedTemplate,
  released: releasedTemplate,
};
