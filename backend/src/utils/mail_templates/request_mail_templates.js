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
  invoiced: invoicedTemplate,
  paid: paidTemplate,
  released: releasedTemplate,
  rejected: rejectedTemplate,
};
