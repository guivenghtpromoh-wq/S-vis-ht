const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/security.middleware');
const { sanitizeInput, validateRegistration } = require('../middleware/validation.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

// Rout Enskripsyon (Sèvi ak Rate Limiter, Sanitizer, ak Validasyon)
router.post('/register', authLimiter, sanitizeInput, validateRegistration, authController.register);

// Rout Koneksyon
router.post('/login', authLimiter, sanitizeInput, authController.login);

// Rout pou li pwofil itilizatè k ap sèvi ak token
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
