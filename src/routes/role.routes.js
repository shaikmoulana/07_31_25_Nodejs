const express = require('express');
const router = express.Router();
const controller = require('../controllers/role.controller');
const { verifyToken } = require('../middlewares/auth.middleware'); // optional

router.get('/', /* verifyToken(['Admin']), */ controller.getAll);
router.post('/', /* verifyToken(['Admin']), */ controller.add);

module.exports = router;
