const jwt = require('jsonwebtoken');
const { EmailClient } = require('@azure/communication-email');
const userLoginRepository = require('../repositories/userLoginRepository'); // To be implemented
const PasswordHasher = require('../utils/passwordHasher');
const config = require('../config/db.config'); // Should contain Jwt and Email service configs

const tokenService = {
  /**
   * Validate user credentials and return JWT token and user info
   * @param {string} emailId
   * @param {string} password
   * @returns {object|null} authentication response or null if invalid
   */
  async validate(emailId, password) {
    try {
      const isValid = await userLoginRepository.validate(emailId, password);
      if (!isValid) return null;

      const role = await userLoginRepository.getUserRole(emailId);
      const name = await userLoginRepository.getUserName(emailId);
      const id = await userLoginRepository.getUserId(emailId);
      const location = await userLoginRepository.getUserLocation(emailId);

      const token = generateToken(emailId, role, name, id, location);

      return { token, name, id, role, location };
    } catch (error) {
      console.error('Error validating user:', error);
      throw error;
    }
  },

  /**
   * Handle forgot password request by generating reset token and sending email
   * @param {string} email
   * @returns {boolean|null} true if email sent, false or null otherwise
   */
  async forgotPassword(email) {
    try {
      const data = await userLoginRepository.getByEmail(email);
      if (!data) return false;

      const forgotPwd = { userId: data.id };
      const forgotPassword = await userLoginRepository.forgotPassword(forgotPwd);
      if (!forgotPassword) return null;

      const resetLink = `${config.App.BaseUrl}/reset-password?token=${forgotPassword.id}`;

      const estTime = new Date(forgotPassword.expiryTime).toLocaleString('en-US', {
        timeZone: 'America/New_York'
      });

      const emailClient = new EmailClient(config.EmailService.connectionString);
      const emailMessage = {
        senderAddress: config.EmailService.senderAddress,
        content: {
          subject: 'Reset Your WLIM Password',
          html: `
            <html>
              <body>
                <p>Hi <strong>${data.name}</strong>,</p>
                <p>Click the link to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link expires at ${estTime} EST.</p>
              </body>
            </html>`
        },
        recipients: { to: [{ address: email }] }
      };

      await emailClient.send({ content: emailMessage.content, recipients: emailMessage.recipients });

      return true;
    } catch (error) {
      console.error('Error handling forgotPassword:', error);
      throw error;
    }
  },

  /**
   * Validate whether the password reset token is valid and unexpired
   * @param {string} token
   * @returns {boolean|null} true if valid, false or null otherwise
   */
  async forgotPasswordValidation(token) {
    try {
      const record = await userLoginRepository.getForgotPassword(token);
      if (!record) return null;

      const diff = new Date(record.expiryTime) - new Date();
      return diff > 0;
    } catch (error) {
      console.error('Error validating forgot password token:', error);
      throw error;
    }
  },

  /**
   * Reset the password given a valid DTO containing token and new password
   * @param {object} dto - ForgotPasswordDTO with token and password
   * @returns {boolean} success status
   */
  async resetPassword(dto) {
    try {
      const forgotPassword = await userLoginRepository.getForgotPassword(dto.token);
      if (!forgotPassword) return false;

      const user = await userLoginRepository.get(forgotPassword.userId);
      if (!user) return false;

      user.password = PasswordHasher.hashPassword(dto.password);
      const resetResult = await userLoginRepository.resetPassword(user);
      if (resetResult) {
        await userLoginRepository.removeForgotPassword(dto.token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
};

/**
 * Generates JWT token based on user details
 * @param {string} email - User's email ID
 * @param {string} role - User role
 * @param {string} name - User name
 * @param {string} id - User ID
 * @param {string} location - User location
 * @returns {string} JWT token
 */
function generateToken(email, role, name, id, location) {
  const payload = {
    email,
    role,
    userName: name,
    id,
    userLocation: location
  };

  return jwt.sign(payload, config.Jwt.Key, {
    issuer: config.Jwt.Issuer,
    audience: config.Jwt.Issuer,
    expiresIn: '2h'
  });
}

module.exports = tokenService;
