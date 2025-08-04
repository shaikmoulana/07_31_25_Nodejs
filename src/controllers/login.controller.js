const tokenService = require('../services/tokenGenerationService');
const ForgotPasswordDTO = require('../dtos/forgotPassword.dto');

const loginController = {
  async getToken(req, res) {
    const { emailId, password } = req.body;

    if (!emailId || !emailId.endsWith('@miraclesoft.com')) {
      return res.status(400).json({ message: 'Email must end with @miraclesoft.com.' });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters long.' });
    }

    try {
      const authResponse = await tokenService.validate(emailId, password);
      if (authResponse?.token) {
        return res.status(200).json(authResponse);
      } else {
        return res.status(401).json({ message: 'Invalid emailId or password.' });
      }
    } catch (err) {
      console.error('Login Error:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },

  async hello(req, res) {
    return res.status(200).send('Hello User');
  },

  async forgotPassword(req, res) {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    try {
      const result = await tokenService.forgotPassword(email);
      return res.status(200).json(result);
    } catch (err) {
      console.error('Forgot Password Error:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },

  async forgotPasswordValidation(req, res) {
    const { token } = req.params;

    if (!token || token === '00000000-0000-0000-0000-000000000000') {
      return res.status(200).json(null);
    }

    try {
      const result = await tokenService.forgotPasswordValidation(token);
      return res.status(200).json(result);
    } catch (err) {
      console.error('Token Validation Error:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },

  async resetPassword(req, res) {
    const dto = new ForgotPasswordDTO(req.body);

    if (!dto.token || dto.token === '00000000-0000-0000-0000-000000000000') {
      return res.status(400).json({ message: 'Invalid or missing token.' });
    }

    try {
      const result = await tokenService.resetPassword(dto);
      return res.status(200).json(result);
    } catch (err) {
      console.error('Reset Password Error:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
};

module.exports = loginController;
