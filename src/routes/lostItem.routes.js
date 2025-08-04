const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/lostItem.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Protect all routes with Admin role via verifyToken middleware
router.get('/', verifyToken(['Admin']), ctrl.getAll);

// Place specific route before the generic dynamic param route
router.get('/ClaimId/:id', verifyToken(['Admin']), ctrl.getByClaimId);
router.get('/:id', verifyToken(['Admin']), ctrl.getById);

router.post('/', verifyToken(['Admin']), ctrl.add);
router.post('/Claim', verifyToken(['Admin']), ctrl.claim);
router.post('/itemPhoto', verifyToken(['Admin']), ctrl.uploadPhoto);

router.put('/:id', verifyToken(['Admin']), ctrl.update);
router.patch('/:id', verifyToken(['Admin']), ctrl.delete);
router.patch('/confirm-receipt/:id', verifyToken(['Admin']), ctrl.confirmReceipt);

router.get('/Locations', verifyToken(['Admin']), ctrl.getLocations);
router.get('/DashboardData/:location', verifyToken(['Admin']), ctrl.dashboardData);
router.get('/UserDashboardData/:user', verifyToken(['Admin']), ctrl.userCountsData);

module.exports = router;
