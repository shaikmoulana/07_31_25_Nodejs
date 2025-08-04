const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

router.post('/', loginController.getToken);
router.get('/', loginController.hello);
router.get('/forgotPassword', loginController.forgotPassword);
router.get('/forgotPasswordValidation/:token', loginController.forgotPasswordValidation);
router.post('/resetPassword', loginController.resetPassword);

module.exports = router;
