const { EmailClient } = require("@azure/communication-email");

const connectionString = process.env.AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING;
const senderAddress = process.env.AZURE_EMAIL_SENDER_ADDRESS; // verified sender email

const emailClient = new EmailClient(connectionString);

exports.sendResetEmail = async (toEmail, name, resetLink, expiry) => {
  try {
    const emailMessage = {
      sender: senderAddress,
      content: {
        subject: "Password Reset Request",
        plainText: `Hi ${name},\n\nYou requested to reset your password. Please click the link below to reset your password:\n\n${resetLink}\n\nThis link expires on ${expiry}.\n\nIf you did not request this, please ignore this email.`,
        html: `<p>Hi ${name},</p>
               <p>You requested to reset your password. Please click the link below to reset your password:</p>
               <p><a href="${resetLink}">Reset Password</a></p>
               <p>This link expires on ${expiry}.</p>
               <p>If you did not request this, please ignore this email.</p>`
      },
      recipients: {
        to: [
          { email: toEmail }
        ]
      }
    };

    const response = await emailClient.send(emailMessage);
    console.log(`Password reset email sent to ${toEmail}, message ID: ${response.id}`);

  } catch (error) {
    console.error(`Failed to send password reset email to ${toEmail}:`, error);
    throw error;
  }
};
