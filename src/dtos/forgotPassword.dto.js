class ForgotPasswordDTO {
    constructor({ token, password }) {
        this.token = token;
        this.password = password;
    }
}

module.exports = ForgotPasswordDTO;
