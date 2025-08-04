const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reports.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken(['Admin']), ctrl.getAll);
router.get('/:id', verifyToken(['Admin']), ctrl.get);
router.post('/', verifyToken(['Admin']), ctrl.add);
router.put('/:id', verifyToken(['Admin']), ctrl.update);

module.exports = router;
    