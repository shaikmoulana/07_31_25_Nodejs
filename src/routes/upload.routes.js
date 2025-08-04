const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/upload.controller');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadController.uploadFile);

module.exports = router;
