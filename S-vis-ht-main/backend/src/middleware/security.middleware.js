const helmet = require('helmet');
const cors = require('cors');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const helmetMiddleware = helmet();

const corsMiddleware = cors({
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

const createLimiter = (maxRequests, windowMs, message) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message || 'Twòp demann, tanpri tann yon ti kras.' },
    keyGenerator: (req) => {
      if (req.user && req.user.id) {
        return `user:${req.user.id}`;
      }
      return ipKeyGenerator(req);
    },
  });
};

const authLimiter = createLimiter(10, 15 * 60 * 1000, 'Twòp tentativ koneksyon.');
const otpLimiter = createLimiter(5, 10 * 60 * 1000, 'Twòp demann OTP.');
const generalLimiter = createLimiter(100, 15 * 60 * 1000, 'Twòp demann sou sèvè a.');

module.exports = {
  helmetMiddleware,
  corsMiddleware,
  authLimiter,
  otpLimiter,
  generalLimiter,
};
