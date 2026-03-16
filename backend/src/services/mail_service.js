const nodemailer = require("nodemailer");
const templates = require("../utils/mail_templates/request_mail_templates");

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
  const template = templates[status];

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

module.exports = {
  SendMail,
};
