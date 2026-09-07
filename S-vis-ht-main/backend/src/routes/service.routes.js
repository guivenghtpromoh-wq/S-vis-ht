const express = require('express');
const router = express.Router();

const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');
const { validate, serviceSchema } = require('../middleware/validation.middleware');
const serviceController = require('../controllers/service.controller');

// Verifye ke metòd yo egziste pou evite TypeError handler
const createService = serviceController.createService || ((req, res) => res.status(501).json({ error: 'Not implemented' }));
const getAllServices = serviceController.getAllServices || ((req, res) => res.status(501).json({ error: 'Not implemented' }));
const getServiceById = serviceController.getServiceById || ((req, res) => res.status(501).json({ error: 'Not implemented' }));
const deleteService = serviceController.deleteService || ((req, res) => res.status(501).json({ error: 'Not implemented' }));

router.post('/', authenticateToken, authorizeRoles('PROFESSIONAL', 'ADMIN'), validate(serviceSchema), createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.delete('/:id', authenticateToken, deleteService);

module.exports = router;
