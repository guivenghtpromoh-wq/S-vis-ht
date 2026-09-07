const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller') || {};
const securityMiddleware = require('../middleware/security.middleware') || {};
const validationMiddleware = require('../middleware/validation.middleware') || {};

// Fallbacks sekirite si gen fonksyon ki manke
const authLimiter = securityMiddleware.authLimiter || ((req, res, next) => next());
const otpLimiter = securityMiddleware.otpLimiter || ((req, res, next) => next());
const validate = validationMiddleware.validate || (() => (req, res, next) => next());

const register = authController.register || ((req, res) => res.status(501).json({ error: 'Register not implemented' }));
const login = authController.login || ((req, res) => res.status(501).json({ error: 'Login not implemented' }));
const refresh = authController.refresh || ((req, res) => res.status(501).json({ error: 'Refresh not implemented' }));
const logout = authController.logout || ((req, res) => res.status(501).json({ error: 'Logout not implemented' }));

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;
