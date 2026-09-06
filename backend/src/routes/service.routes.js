const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const { authenticateToken, authorizeRoles, verifyResourceOwnership } = require('../middleware/auth.middleware');
const { sanitizeInput } = require('../middleware/validation.middleware');

// Rout piblik: Tout moun ka gade sèvis yo
router.get('/', serviceController.getAllServices);

// Kreyasyon pwofil pwofesyonèl (Sèlman moun ki pwofesyonèl)
router.post('/profile', authenticateToken, authorizeRoles('PROFESSIONAL', 'ADMIN', 'SUPER_ADMIN'), sanitizeInput, serviceController.createProfessionalProfile);

// Kreyasyon demann sèvis (Sèlman kliyan oswa admin)
router.post('/request', authenticateToken, authorizeRoles('CUSTOMER', 'ADMIN', 'SUPER_ADMIN'), sanitizeInput, serviceController.createServiceRequest);

// Lekti demann yon itilizatè spesifik (Pwoteksyon IDOR: Sèlman mèt kont lan oswa Admin ki ka li l)
router.get('/user/:userId/requests', authenticateToken, verifyResourceOwnership('userId'), serviceController.getUserRequests);

module.exports = router;
