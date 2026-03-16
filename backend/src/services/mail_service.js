const nodemailer = require("nodemailer");
const requestedTemplate = require("../utils/mail_templates/request_mail_templates");
const templates = require("../utils/mail_templates/email_templates");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function SendMail({ to, status, data }) {
  const template = requestedTemplate[status];

  if (!template) {
    throw new Error("Invalid request status");
  }

  const { subject, html } = template(data);

  await transporter.sendMail({
    from: `"Registrar Office" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

async function SendRMOUpdateMail({ request, status, reason }) {
  const template = templates[status];

  if (!template) {
    return;
  }

  const { subject, html } =
    status === "rejected" ? template(request, reason) : template(request);

  await transporter.sendMail({
    from: `"Registrar Office" <${process.env.SMTP_USER}>`,
    to: request.student.email,
    subject,
    html,
  });
}

async function SendCashierUpdateMail({ request, status }) {
  const template = templates[status];

  if (!template) {
    return;
  }

  const { subject, html } = template(request);

  await transporter.sendMail({
    from: `"Registrar Office" <${process.env.SMTP_USER}>`,
    to: request.student.email,
    subject,
    html,
  });
}

module.exports = {
  SendMail,
  SendRMOUpdateMail,
  SendCashierUpdateMail,
};
