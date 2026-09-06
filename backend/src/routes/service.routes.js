const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const { authenticateToken, authorizeRoles, verifyResourceOwnership } = require('../middleware/auth.middleware');
const { serviceLimiter } = require('../middleware/security.middleware');
const { validateServiceRequest } = require('../middleware/validation.middleware');
const { logAuditEvent } = require('../middleware/audit.middleware');
const upload = require('../middleware/upload.middleware');

// Create professional profile
router.post(
  '/professional',
  authenticateToken,
  authorizeRoles('PROFESSIONAL'),
  serviceLimiter,
  logAuditEvent('PROFESSIONAL_PROFILE_CREATED'),
  serviceController.createProfessionalProfile
);

// Get professional profile
router.get(
  '/professional/:id',
  authenticateToken,
  serviceController.getProfessionalProfile
);

// Update professional profile
router.patch(
  '/professional/:id',
  authenticateToken,
  authorizeRoles('PROFESSIONAL', 'ADMIN', 'SUPER_ADMIN'),
  verifyResourceOwnership('id', 'professional_profile'),
  serviceLimiter,
  logAuditEvent('PROFESSIONAL_PROFILE_UPDATED'),
  serviceController.updateProfessionalProfile
);

// List all services (public)
router.get(
  '/',
  serviceController.getAllServices
);

// Create service request
router.post(
  '/request',
  authenticateToken,
  authorizeRoles('CUSTOMER'),
  serviceLimiter,
  sanitizeInput,
  validateServiceRequest,
  logAuditEvent('SERVICE_REQUEST_CREATED'),
  serviceController.createServiceRequest
);

// Get user's service requests (IDOR protected)
router.get(
  '/requests/user/:userId',
  authenticateToken,
  verifyResourceOwnership('userId', 'user'),
  logAuditEvent('SERVICE_REQUESTS_VIEWED'),
  serviceController.getUserRequests
);

// Get specific service request (IDOR protected)
router.get(
  '/request/:id',
  authenticateToken,
  verifyResourceOwnership('id', 'service_request'),
  serviceController.getServiceRequest
);

// Update service request status
router.patch(
  '/request/:id/status',
  authenticateToken,
  verifyResourceOwnership('id', 'service_request'),
  serviceLimiter,
  logAuditEvent('SERVICE_REQUEST_UPDATED'),
  serviceController.updateServiceRequestStatus
);

// Cancel service request
router.delete(
  '/request/:id',
  authenticateToken,
  verifyResourceOwnership('id', 'service_request'),
  serviceLimiter,
  logAuditEvent('SERVICE_REQUEST_CANCELLED'),
  serviceController.cancelServiceRequest
);

// Upload service image
router.post(
  '/upload-image',
  authenticateToken,
  upload.single('image'),
  logAuditEvent('SERVICE_IMAGE_UPLOADED'),
  serviceController.uploadServiceImage
);

module.exports = router;
