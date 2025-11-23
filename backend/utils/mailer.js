// emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create Brevo SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_PASSWORD
  }
});

// Verify SMTP
transporter.verify((err, success) => {
  if (err) {
    console.error("[MAIL] SMTP Error:", err);
  } else {
    console.log("[MAIL] Brevo SMTP is ready");
  }
});

// Email templates
const emailTemplates = {
  otp: (otp) => `
    <!DOCTYPE html>
    <html>
      <body>
        <h2>Your UniVents OTP</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      </body>
    </html>
  `,

  eventNotification: (data) => `
    <!DOCTYPE html>
    <html>
      <body>
        <h2>New Event: ${data.event.title}</h2>
        <p>Hello ${data.user.name}, a new event matches your interests!</p>
        <p>${data.event.description}</p>
      </body>
    </html>
  `,

  passwordReset: (otp) => `
    <!DOCTYPE html>
    <html>
      <body>
        <h2>Password Reset Code</h2>
        <h1>${otp}</h1>
        <p>Use this code to reset your password.</p>
      </body>
    </html>
  `
};

// Main send function
exports.sendMail = async ({ to, subject, html, template, data }) => {
  let emailHtml = html;

  if (template && emailTemplates[template]) {
    emailHtml = emailTemplates[template](data);
  }

  return transporter.sendMail({
    from: process.env.BREVO_FROM_EMAIL,
    to,
    subject,
    html: emailHtml
  });
};

// Convenience methods
exports.sendOTPEmail = async (to, otp) => {
  return exports.sendMail({
    to,
    subject: "UniVents Login OTP",
    template: "otp",
    data: otp
  });
};

exports.sendEventNotificationEmail = async (user, event) => {
  return exports.sendMail({
    to: user.email,
    subject: `New Event for You: ${event.title}`,
    template: "eventNotification",
    data: { user, event }
  });
};

exports.sendPasswordResetEmail = async (to, otp) => {
  return exports.sendMail({
    to,
    subject: "UniVents Password Reset OTP",
    template: "passwordReset",
    data: otp
  });
};
