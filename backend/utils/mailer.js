  } else {
  console.log('[MAIL] SMTP transporter ready');
}
});

// Email templates that match UniVents theme
const emailTemplates = {
  otp: (otp) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>UniVents Login Verification</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0; 
          padding: 0; 
          background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
          color: #ffffff;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(31, 41, 55, 0.95);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(75, 85, 99, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          color: #111827;
          font-size: 32px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.025em;
        }
        .content {
          padding: 40px 30px;
        }
        .otp-box {
          background: rgba(251, 191, 36, 0.1);
          border: 2px solid #fbbf24;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 32px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 4px;
          margin: 10px 0;
        }
        .info-text {
          color: #d1d5db;
          line-height: 1.6;
          margin: 20px 0;
        }
        .warning {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #fca5a5;
        }
        .footer {
          background: rgba(17, 24, 39, 0.8);
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid rgba(75, 85, 99, 0.3);
        }
        .footer p {
          color: #9ca3af;
          font-size: 14px;
          margin: 0;
        }
        .highlight {
          color: #fbbf24;
          font-weight: 600;
        }
      </style>
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
          
          <p class="info-text">
            Enter this code in the UniVents app to complete your login process. 
            If you didn't request this code, please ignore this email.
          </p>
          
          <div class="warning">
            <strong>Security Notice:</strong> Never share this code with anyone. 
            UniVents will never ask for your verification code via email or phone.
          </div>
        </div>
        <div class="footer">
          <p>© 2024 UniVents. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  eventNotification: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Event: ${data.event.title}</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0; 
          padding: 0; 
          background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
          color: #ffffff;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(31, 41, 55, 0.95);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(75, 85, 99, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          color: #111827;
          font-size: 32px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.025em;
        }
        .content {
          padding: 40px 30px;
        }
        .event-card {
          background: rgba(75, 85, 99, 0.3);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 12px;
          padding: 25px;
          margin: 25px 0;
        }
        .event-title {
          color: #fbbf24;
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 15px 0;
        }
        .event-details {
          color: #d1d5db;
          line-height: 1.6;
          margin: 15px 0;
        }
        .event-meta {
          background: rgba(17, 24, 39, 0.5);
          border-radius: 8px;
          padding: 15px;
          margin: 15px 0;
        }
        .meta-item {
          display: flex;
          align-items: center;
          margin: 8px 0;
          color: #9ca3af;
        }
        .meta-icon {
          width: 20px;
          margin-right: 10px;
          color: #fbbf24;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #111827;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          transition: all 0.3s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(251, 191, 36, 0.3);
        }
        .footer {
          background: rgba(17, 24, 39, 0.8);
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid rgba(75, 85, 99, 0.3);
        }
        .footer p {
          color: #9ca3af;
          font-size: 14px;
          margin: 0;
        }
        .highlight {
          color: #fbbf24;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>UniVents</h1>
        </div>
        <div class="content">
          <h2 style="color: #fbbf24; margin: 0 0 20px 0; font-size: 24px;">New Event for You!</h2>
          <p style="color: #d1d5db; line-height: 1.6; margin: 0 0 25px 0;">
            Hi <span class="highlight">${data.user.name}</span>, we found an event that matches your interests!
          </p>
          
          <div class="event-card">
            <h3 class="event-title">${data.event.title}</h3>
            <p class="event-details">${data.event.description}</p>
            
            <div class="event-meta">
              <div class="meta-item">
                <span class="meta-icon">📅</span>
                <span>Date: ${new Date(data.event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📍</span>
                <span>Location: ${data.event.location}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">🏷️</span>
                <span>Category: ${data.event.category}</span>
              </div>
              ${data.event.price ? `<div class="meta-item">
                <span class="meta-icon">💰</span>
                <span>Price: ${data.event.price === 0 ? 'Free' : `$${data.event.price}`}</span>
              </div>` : ''}
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="https://google.com" class="cta-button">
              View Event Details →
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 14px; margin: 20px 0 0 0; text-align: center;">
            This event was recommended based on your interests and location preferences.
          </p>
        </div>
        <div class="footer">
          <p>© 2024 UniVents. All rights reserved.</p>
          <p>You can manage your notification preferences in your UniVents account settings.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  passwordReset: (otp) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>UniVents Password Reset</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0; 
          padding: 0; 
          background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
          color: #ffffff;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(31, 41, 55, 0.95);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(75, 85, 99, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          color: #111827;
          font-size: 32px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.025em;
        }
        .content {
          padding: 40px 30px;
        }
        .otp-box {
          background: rgba(251, 191, 36, 0.1);
          border: 2px solid #fbbf24;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 32px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 4px;
          margin: 10px 0;
        }
        .info-text {
          color: #d1d5db;
          line-height: 1.6;
          margin: 20px 0;
        }
        .warning {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #fca5a5;
        }
        .footer {
          background: rgba(17, 24, 39, 0.8);
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid rgba(75, 85, 99, 0.3);
        }
        .footer p {
          color: #9ca3af;
          font-size: 14px;
          margin: 0;
        }
        .highlight {
          color: #fbbf24;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>UniVents</h1>
        </div>
        <div class="content">
          <h2 style="color: #fbbf24; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
          <p class="info-text">You requested to reset your UniVents password. Use this verification code:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">This code will expire in 10 minutes</p>
          </div>
          
          <p class="info-text">
            Enter this code in the password reset form to create a new password. 
            If you didn't request a password reset, please ignore this email.
          </p>
          
          <div class="warning">
            <strong>Security Notice:</strong> Never share this code with anyone. 
            UniVents will never ask for your verification code via email or phone.
          </div>
        </div>
        <div class="footer">
          <p>© 2024 UniVents. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

exports.sendMail = async ({ to, subject, html, template, data }) => {
  let emailHtml = html;

  // Use template if provided
  if (template && emailTemplates[template]) {
    emailHtml = emailTemplates[template](data);
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: emailHtml
  });
};

// Convenience methods for different email types
exports.sendOTPEmail = async (to, otp) => {
  return this.sendMail({
    to,
    subject: 'UniVents Login OTP',
    template: 'otp',
    data: otp
  });
};

exports.sendEventNotificationEmail = async (user, event) => {
  return this.sendMail({
    to: user.email,
    subject: `New Event for You: ${event.title}`,
    template: 'eventNotification',
    data: { user, event }
  });
};

exports.sendPasswordResetEmail = async (to, otp) => {
  return this.sendMail({
    to,
    subject: 'UniVents Password Reset OTP',
    template: 'passwordReset',
    data: otp
  });
}; 