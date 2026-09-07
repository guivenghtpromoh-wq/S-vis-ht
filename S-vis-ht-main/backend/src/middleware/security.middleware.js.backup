const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { RATE_LIMITS } = require('../config/constants');

// Security headers with Helmet
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  noSniff: true,
  xssFilter: true,
  frameguard: { action: 'deny' }
});

// CORS with strict configuration
const corsOptions = cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:3000'];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Confirm-Action'],
  credentials: true,
  maxAge: 600
});

// CSRF token middleware
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const csrfProtection = csrf({ cookie: false });

// Rate limiters
const authLimiter = rateLimit({
  windowMs: RATE_LIMITS.AUTH.windowMs,
  max: RATE_LIMITS.AUTH.max,
  message: { error: 'Twòp demann koneksyon. Tanpri tann 15 minit anvan w eseye ankò.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test'
});

const otpLimiter = rateLimit({
  windowMs: RATE_LIMITS.OTP.windowMs,
  max: RATE_LIMITS.OTP.max,
  message: { error: 'Twòp tantativ verifikasyon OTP. Tanpri tann.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test'
});

const serviceLimiter = rateLimit({
  windowMs: RATE_LIMITS.SERVICE.windowMs,
  max: RATE_LIMITS.SERVICE.max,
  message: { error: 'Ou depase limit demann pou kreyasyon sèvis.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip,
  skip: (req) => process.env.NODE_ENV === 'test'
});

const messageLimiter = rateLimit({
  windowMs: RATE_LIMITS.MESSAGE.windowMs,
  max: RATE_LIMITS.MESSAGE.max,
  message: { error: 'Ou depase limit demann pou mesaj.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip,
  skip: (req) => process.env.NODE_ENV === 'test'
});

const generalLimiter = rateLimit({
  windowMs: RATE_LIMITS.GENERAL.windowMs,
  max: RATE_LIMITS.GENERAL.max,
  message: { error: 'Ou depase limit demann. Tanpri tann.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test'
});

module.exports = {
  securityHeaders,
  corsOptions,
  csrfProtection,
  authLimiter,
  otpLimiter,
  serviceLimiter,
  messageLimiter,
  generalLimiter
};
