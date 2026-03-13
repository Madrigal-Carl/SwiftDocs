function pendingTemplate(data) {
  const fullName = data.student.getFullName();

  return {
    subject: "Update on Your Document Request",
    html: `
      <p>Dear ${fullName},</p>

      <p>We would like to inform you that your request for academic documents with reference number 
      <strong>${data.reference_number}</strong> is currently <strong>under review</strong>.</p>

      <p>Our office is presently verifying the details of your request. You will be notified once the next step becomes available.</p>

      <p>Thank you for your patience.</p>

      <p>Sincerely,<br>
      Registrar Office</p>
    `,
  };
}

function invoicedTemplate(data) {
  const fullName = data.student.getFullName();

  return {
    subject: "Invoice for Your Document Request",
    html: `
      <p>Dear ${fullName},</p>

      <p>This is to inform you that an invoice has been generated for your document request with reference number 
      <strong>${data.reference_number}</strong>.</p>

      <p>Please proceed with the required payment so that we may begin processing your requested documents.</p>

      <p>If payment has already been completed, kindly disregard this message.</p>

      <p>Sincerely,<br>
      Registrar Office</p>
    `,
  };
}

function paidTemplate(data) {
  const fullName = data.student.getFullName();

  return {
    subject: "Processing of Your Document Request",
    html: `
      <p>Dear ${fullName},</p>

      <p>We acknowledge receipt of your payment for the document request with reference number 
      <strong>${data.reference_number}</strong>.</p>

      <p>Your requested documents are now being processed. You will be notified once they are ready for release.</p>

      <p>Sincerely,<br>
      Registrar Office</p>
    `,
  };
}

function releasedTemplate(data) {
  const fullName = data.student.getFullName();

  return {
    subject: "Documents Ready for Release",
    html: `
      <p>Dear ${fullName},</p>

      <p>We are pleased to inform you that your requested documents under reference number 
      <strong>${data.reference_number}</strong> have been successfully processed and released.</p>

      <p>You may now coordinate with the Registrar Office should you require further assistance.</p>

      <p>Sincerely,<br>
      Registrar Office</p>
    `,
  };
}

function rejectedTemplate(data) {
  const fullName = data.student.getFullName();

  return {
    subject: "Update Regarding Your Document Request",
    html: `
      <p>Dear ${fullName},</p>

      <p>We regret to inform you that your document request with reference number 
      <strong>${data.reference_number}</strong> has been <strong>rejected</strong>.</p>

      <p>If you believe this decision was made in error or if further clarification is required, please contact the Registrar Office.</p>

      <p>Sincerely,<br>
      Registrar Office</p>
    `,
  };
}

module.exports = {
  pending: pendingTemplate,
  invoiced: invoicedTemplate,
  paid: paidTemplate,
  released: releasedTemplate,
  rejected: rejectedTemplate,
};
