// emailService.js
const axios = require("axios");
require("dotenv").config();

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

// Main send function using Brevo HTTP API
exports.sendMail = async ({ to, subject, html, template, data }) => {
  let emailHtml = html;

  if (template && emailTemplates[template]) {
    emailHtml = emailTemplates[template](data);
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("[MAIL] Missing BREVO_API_KEY environment variable");
    throw new Error("Email configuration error");
  }

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.BREVO_FROM_EMAIL || "noreply@univents.com",
          name: "UniVents"
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: emailHtml
      },
      {
        headers: {
          "accept": "application/json",
          "api-key": apiKey,
          "content-type": "application/json"
        }
      }
    );

    console.log("[MAIL] Email sent successfully via API:", response.data);
    return response.data;
  } catch (error) {
    console.error("[MAIL] API Error:", error.response ? error.response.data : error.message);
    throw error;
  }
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
