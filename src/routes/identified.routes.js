const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/identified.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', verifyToken(["Admin", "User"]), controller.getAll);
router.post('/', verifyToken(["Admin"]), upload.single('file'), controller.uploadItem);

module.exports = router;
