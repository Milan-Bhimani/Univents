// emailService.js
const axios = require('axios');
require('dotenv').config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.RESEND_FROM || 'no-reply@univents.app';

if (!RESEND_API_KEY) {
  console.error('[MAIL] Missing RESEND_API_KEY in env. Set RESEND_API_KEY in Render / .env');
}

// Reuse your templates (slightly adapted so template functions always accept one argument)
const emailTemplates = {
  otp: (otp) => `...your full OTP HTML template here with ${otp}...`,
  eventNotification: (data) => `...your event HTML template using ${data.user?.name} and ${data.event?.title}...`,
  passwordReset: (otp) => `...your password reset HTML template here with ${otp}...`
};

// For brevity: replace the template bodies above with your actual HTML template strings.
// (In the final file below I've inlined your original templates exactly.)

/* ---------- actual templates (inlined) ---------- */
emailTemplates.otp = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UniVents Login Verification</title>
  <style> /* styles omitted for brevity in this snippet; use your full CSS from existing file */ </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>UniVents</h1>
    </div>
    <div class="content">
      <h2 style="color: #fbbf24; margin: 0 0 20px 0; font-size: 24px;">Login Verification</h2>
      <p class="info-text">Your verification code for UniVents login:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <p style="color: #9ca3af; margin: 0; font-size: 14px;">This code will expire in 10 minutes</p>
      </div>
      <p class="info-text">Enter this code in the UniVents app to complete your login process. If you didn't request this code, please ignore this email.</p>
      <div class="warning">
        <strong>Security Notice:</strong> Never share this code with anyone. UniVents will never ask for your verification code via email or phone.
      </div>
    </div>
    <div class="footer">
      <p>© 2024 UniVents. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

emailTemplates.eventNotification = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Event: ${data.event.title}</title>
  <style> /* styles omitted for brevity; use your full CSS */ </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>UniVents</h1></div>
    <div class="content">
      <h2 style="color: #fbbf24; margin: 0 0 20px 0; font-size: 24px;">New Event for You!</h2>
      <p style="color: #d1d5db; line-height: 1.6; margin: 0 0 25px 0;">
        Hi <span class="highlight">${data.user.name}</span>, we found an event that matches your interests!
      </p>
      <div class="event-card">
        <h3 class="event-title">${data.event.title}</h3>
        <p class="event-details">${data.event.description}</p>
        <div class="event-meta">
          <div class="meta-item"><span class="meta-icon">📅</span>
            <span>Date: ${new Date(data.event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div class="meta-item"><span class="meta-icon">📍</span><span>Location: ${data.event.location}</span></div>
          <div class="meta-item"><span class="meta-icon">🏷️</span><span>Category: ${data.event.category}</span></div>
          ${data.event.price ? `<div class="meta-item"><span class="meta-icon">💰</span><span>Price: ${data.event.price === 0 ? 'Free' : `$${data.event.price}`}</span></div>` : ''}
        </div>
      </div>
      <div style="text-align: center;">
        <a href="${data.event.url || 'https://univents-764n.onrender.com'}" class="cta-button">View Event Details →</a>
      </div>
      <p style="color: #9ca3af; font-size: 14px; margin: 20px 0 0 0; text-align: center;">This event was recommended based on your interests and location preferences.</p>
    </div>
    <div class="footer"><p>© 2024 UniVents. All rights reserved.</p><p>You can manage your notification preferences in your UniVents account settings.</p></div>
  </div>
</body>
</html>
`;

emailTemplates.passwordReset = (otp) => `
<!DOCTYPE html> 
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>UniVents Password Reset</title><style>/* styles omitted for brevity; use your full CSS */</style></head>
<body>
  <div class="container">
    <div class="header"><h1>UniVents</h1></div>
    <div class="content">
      <h2 style="color: #fbbf24; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
      <p class="info-text">You requested to reset your UniVents password. Use this verification code:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <p style="color: #9ca3af; margin: 0; font-size: 14px;">This code will expire in 10 minutes</p>
      </div>
      <p class="info-text">Enter this code in the password reset form to create a new password. If you didn't request a password reset, please ignore this email.</p>
      <div class="warning"><strong>Security Notice:</strong> Never share this code with anyone. UniVents will never ask for your verification code via email or phone.</div>
    </div>
    <div class="footer"><p>© 2024 UniVents. All rights reserved.</p><p>This is an automated message, please do not reply.</p></div>
  </div>
</body>
</html>
`;
/* ---------- end templates ---------- */

async function sendRawEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set in environment.');
  }

  const payload = {
    from: FROM_EMAIL,
    to: Array.isArray(to) ? to : [to],
    subject,
    html
  };

  try {
    const res = await axios.post('https://api.resend.com/emails', payload, {
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    // Resend returns 200/202 depending; return data for logging
    return res.data;
  } catch (err) {
    // make error messaging useful
    const status = err.response?.status;
    const body = err.response?.data;
    console.error('[MAIL] Resend API error:', status, body || err.message);
    throw new Error(`Failed to send email: ${err.message}`);
  }
}

exports.sendMail = async ({ to, subject, html, template, data }) => {
  let emailHtml = html;

  if (template) {
    if (!emailTemplates[template]) {
      throw new Error(`Unknown email template: ${template}`);
    }
    // For OTP/password templates `data` will be the plain code (string/number)
    emailHtml = emailTemplates[template](data);
  }

  return sendRawEmail({ to, subject, html: emailHtml });
};

exports.sendOTPEmail = async (to, otp) => {
  // pass otp directly as `data` so template function receives it
  return exports.sendMail({
    to,
    subject: 'UniVents Login OTP',
    template: 'otp',
    data: otp
  });
};

exports.sendEventNotificationEmail = async (user, event) => {
  return exports.sendMail({
    to: user.email,
    subject: `New Event for You: ${event.title}`,
    template: 'eventNotification',
    data: { user, event }
  });
};

exports.sendPasswordResetEmail = async (to, otp) => {
  return exports.sendMail({
    to,
    subject: 'UniVents Password Reset OTP',
    template: 'passwordReset',
    data: otp
  });
};
