const express = require('express');
const router = express.Router();
const twoFactorController = require('../controllers/twofactor.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');
const { logAuditEvent } = require('../middleware/audit.middleware');

// Setup 2FA (Admin only)
router.post(
  '/2fa/setup',
  authenticateToken,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  logAuditEvent('2FA_SETUP_INITIATED'),
  twoFactorController.setup2FA
);

// Verify and enable 2FA (Admin only)
router.post(
  '/2fa/verify',
  authenticateToken,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  logAuditEvent('2FA_VERIFICATION_ATTEMPT'),
  twoFactorController.verify2FA
);

// Disable 2FA (Admin only)
router.post(
  '/2fa/disable',
  authenticateToken,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  logAuditEvent('2FA_DISABLED'),
  twoFactorController.disable2FA
);

module.exports = router;
