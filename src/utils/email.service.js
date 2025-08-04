const { EmailClient } = require('@azure/communication-email');
const config = require('../config/db.config'); // Adjust path to your config

// Create a singleton EmailClient instance
const emailClient = new EmailClient(config.EmailService.connectionString);

/**
 * Send a password reset email
 * @param {string} toEmail - Recipient email
 * @param {string} name - Recipient name
 * @param {string} resetLink - Password reset URL
 * @param {string} expiry - Expiry time string for reset link
 */
async function sendResetEmail(toEmail, name, resetLink, expiry) {
  const emailMessage = {
    senderAddress: config.EmailService.senderAddress,
    content: {
      subject: 'Reset Your WLIM Password',
      html: `
        <p>Hi <strong>${name}</strong>,</p>
        <p>Click the link to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link expires at ${expiry}.</p>
      `
    },
    recipients: {
      to: [{ address: toEmail }]
    }
  };

  try {
    const response = await emailClient.send(emailMessage);
    console.log(`Reset email sent to ${toEmail}. Message ID: ${response.id}`);
  } catch (err) {
    console.error(`Failed to send reset email to ${toEmail}:`, err);
    throw err;
  }
}

/**
 * Send a notification email about an item (example)
 * @param {string} toEmail - Recipient email
 * @param {string} name - Recipient name
 * @param {string} category - Item category for the notification
 */
async function sendItemNotification(toEmail, name, category) {
  const emailMessage = {
    senderAddress: config.EmailService.senderAddress,
    content: {
      subject: `Notification about new item in ${category}`,
      html: `
        <p>Hi <strong>${name}</strong>,</p>
        <p>A new item has been reported in the category <strong>${category}</strong>.</p>
        <p>Please check the system for details.</p>
      `
    },
    recipients: {
      to: [{ address: toEmail }]
    }
  };

  try {
    const response = await emailClient.send(emailMessage);
    console.log(`Notification email sent to ${toEmail}. Message ID: ${response.id}`);
  } catch (err) {
    console.error(`Failed to send notification email to ${toEmail}:`, err);
    throw err;
  }
}

module.exports = {
  sendResetEmail,
  sendItemNotification
};
