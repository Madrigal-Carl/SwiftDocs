const path = require("path");

function pendingTemplate(data) {
  const fullName = data.student.getFullName();

  return {
    subject: "Request Received",
    html: `
      <p>Hi ${fullName},</p>

      <p>We’ve received your document request (Ref: <strong>${data.reference_number}</strong>).</p>

      <p>We’ll keep you posted as it moves forward.</p>

      <p>– Registrar Office</p>
    `,
  };
}

function underReviewTemplate(data) {
  const fullName = data.student.getFullName();

  return {
    subject: "Request Update: Under Review",
    html: `
      <p>Hi ${fullName},</p>

      <p>Your request (Ref: <strong>${data.reference_number}</strong>) is now <strong>under review</strong>.</p>

      <p>We’re currently checking your details and requirements.</p>

      <p>More updates soon.</p>

      <p>– Registrar Office</p>
    `,
  };
}

function deficientTemplate(data) {
  const fullName = data.student.getFullName();

  return {
    subject: "Request Update: Action Needed",
    html: `
      <p>Hi ${fullName},</p>

      <p>Your request (Ref: <strong>${data.reference_number}</strong>) needs a bit more info.</p>

      ${data.notes ? `<p><strong>Required:</strong> ${data.notes}</p>` : ""}

      <p>Please submit the missing requirement(s) so we can continue processing.</p>

      <p>– Registrar Office</p>
    `,
  };
}

function balanceDueTemplate(data) {
  const fullName = data.student.getFullName();

  return {
    subject: "Request Update: Balance Due",
    html: `
      <p>Hi ${fullName},</p>

      <p>Your request (Ref: <strong>${data.reference_number}</strong>) has a remaining balance.</p>

      ${data.notes ? `<p><strong>Details:</strong> ${data.notes}</p>` : ""}

      <p>Please settle it so we can proceed.</p>

      <p>– Registrar Office</p>
    `,
  };
}

function invoicedTemplate(data) {
  const fullName = data.student.getFullName();

  return {
    subject: "Request Update: Invoice Ready",
    html: `
      <p>Hi ${fullName},</p>

      <p>Your request (Ref: <strong>${data.reference_number}</strong>) now has an invoice.</p>

      <p>You can proceed with payment anytime.</p>

      <p>– Registrar Office</p>
    `,
  };
}

function paidTemplate(data) {
  const fullName = data.student.getFullName();

  return {
    subject: "Request Update: Payment Received",
    html: `
      <p>Hi ${fullName},</p>

      <p>We’ve received your payment for request <strong>${data.reference_number}</strong>.</p>

      <p>Your documents are now being processed.</p>

      <p>– Registrar Office</p>
    `,
  };
}

function releasedTemplate(data) {
  const fullName = data.student.getFullName();

  const releaseMessage =
    data.delivery_method === "delivery"
      ? `<p>Your documents will be delivered to your address: ${data.student.address}</p>`
      : `<p>You can now coordinate with the Registrar Office for release.</p>`;

  return {
    subject: "Request Update: Documents Released",
    attachments: [
      {
        filename: "feedback-qr.png",
        path: path.join(__dirname, "qr.png"),
        cid: "feedbackqr",
      },
    ],
    html: `
      <p>Hi ${fullName},</p>

      <p>Good news! Your documents (Ref: <strong>${data.reference_number}</strong>) have been released.</p>

      ${releaseMessage}

      <p><strong>We would appreciate your feedback:</strong></p>

      <img 
        src="cid:feedbackqr"
        alt="Feedback QR Code"
        style="width:200px;height:200px;margin-top:10px;"
      />

      <p>Scan the QR code above to leave feedback.</p>
      
      <p>– Registrar Office</p>
    `,
  };
}

function rejectedTemplate(data) {
  const fullName = data.student.getFullName();

  return {
    subject: "Request Update: Not Approved",
    html: `
      <p>Hi ${fullName},</p>

      <p>Your request (Ref: <strong>${data.reference_number}</strong>) was not approved.</p>

      <p>If you have questions or want to try again, feel free to contact us.</p>

      <p>– Registrar Office</p>
    `,
  };
}

module.exports = {
  pending: pendingTemplate,
  under_review: underReviewTemplate,
  deficient: deficientTemplate,
  balance_due: balanceDueTemplate,
  invoiced: invoicedTemplate,
  paid: paidTemplate,
  released: releasedTemplate,
  rejected: rejectedTemplate,
};
