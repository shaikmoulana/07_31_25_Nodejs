const crypto = require('crypto');

class PasswordHasher {
  static hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password, 'utf8');
    return hash.digest('hex').toLowerCase();
  }
}

module.exports = PasswordHasher;
