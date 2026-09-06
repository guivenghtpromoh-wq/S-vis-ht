const xss = require('xss');
const { PASSWORD_REGEX } = require('../config/constants');

// Sanitize input to prevent XSS
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Don't sanitize passwords
        if (!key.toLowerCase().includes('password')) {
          req.body[key] = xss(req.body[key].trim());
        }
      } else if (typeof req.body[key] === 'object' && req.body[key] !== null) {
        // Recursively sanitize nested objects
        req.body[key] = JSON.parse(JSON.stringify(req.body[key]));
      }
    }
  }
  next();
};

// Validate registration input
const validateRegistration = (req, res, next) => {
  const { fullName, phone, password, email } = req.body;

  // Full name validation
  if (!fullName || fullName.trim().length < 2) {
    return res.status(400).json({ error: 'Non an dwe gen omwen 2 karaktè.' });
  }

  if (fullName.trim().length > 255) {
    return res.status(400).json({ error: 'Non an pè twòp long.' });
  }

  // Phone validation
  const phoneRegex = /^[0-9+\s-]{8,15}$/;
  if (!phone || !phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Nimewo telefòn lan pa valid.' });
  }

  // Email validation (optional)
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Adrès imel la pa valid.' });
    }
  }

  // Password validation
  if (!password || password.length < 12) {
    return res.status(400).json({
      error: 'Modpas la dwe gen omwen 12 karaktè, yon majiskil, yon miniskil, yon chif, ak yon karaktè espesyal (@$!%*?&).'
    });
  }

  if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({
      error: 'Modpas la dwe gen omwen 12 karaktè, yon majiskil, yon miniskil, yon chif, ak yon karaktè espesyal (@$!%*?&).'
    });
  }

  next();
};

// Validate login input
const validateLogin = (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: 'Nimewo telefòn ak modpas nesesè.' });
  }

  next();
};

// Validate password reset request
const validatePasswordResetRequest = (req, res, next) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Nimewo telefòn nesesè.' });
  }

  next();
};

// Validate password reset
const validatePasswordReset = (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token ak modpas nesesè.' });
  }

  if (!PASSWORD_REGEX.test(newPassword)) {
    return res.status(400).json({
      error: 'Modpas la dwe gen omwen 12 karaktè, yon majiskil, yon miniskil, yon chif, ak yon karaktè espesyal (@$!%*?&).'
    });
  }

  next();
};

// Validate service request input
const validateServiceRequest = (req, res, next) => {
  const { description, professionalId } = req.body;

  if (!description || description.trim().length === 0) {
    return res.status(400).json({ error: 'Deskripsyon sèvis nesesè.' });
  }

  if (description.length > 5000) {
    return res.status(400).json({ error: 'Deskripsyon twòp long.' });
  }

  if (!professionalId) {
    return res.status(400).json({ error: 'ID pwofesyonèl nesesè.' });
  }

  next();
};

module.exports = {
  sanitizeInput,
  validateRegistration,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateServiceRequest
};
