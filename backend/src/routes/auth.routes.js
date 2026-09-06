const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const passwordResetController = require('../controllers/password-reset.controller');
const otpController = require('../controllers/otp.controller');
const { authLimiter, otpLimiter } = require('../middleware/security.middleware');
const { sanitizeInput, validateRegistration, validateLogin, validatePasswordResetRequest, validatePasswordReset } = require('../middleware/validation.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');
const { logAuditEvent } = require('../middleware/audit.middleware');

// Registration
router.post(
  '/register',
  authLimiter,
  sanitizeInput,
  validateRegistration,
  logAuditEvent('REGISTRATION_ATTEMPT'),
  authController.register
);

// Login
router.post(
  '/login',
  authLimiter,
  sanitizeInput,
  validateLogin,
  logAuditEvent('LOGIN_ATTEMPT'),
  authController.login
);

// Verify OTP during login
router.post(
  '/verify-otp',
  otpLimiter,
  sanitizeInput,
  otpController.verifyOTP
);

// Resend OTP
router.post(
  '/resend-otp',
  otpLimiter,
  otpController.resendOTP
);

// Get current user profile
router.get(
  '/me',
  authenticateToken,
  authController.getMe
);

// Logout
router.post(
  '/logout',
  authenticateToken,
  logAuditEvent('LOGOUT'),
  authController.logout
);

// Request password reset
router.post(
  '/forgot-password',
  authLimiter,
  sanitizeInput,
  validatePasswordResetRequest,
  logAuditEvent('PASSWORD_RESET_REQUESTED'),
  passwordResetController.requestPasswordReset
);

// Reset password
router.post(
  '/reset-password',
  authLimiter,
  sanitizeInput,
  validatePasswordReset,
  logAuditEvent('PASSWORD_RESET_ATTEMPT'),
  passwordResetController.resetPassword
);

module.exports = router;
