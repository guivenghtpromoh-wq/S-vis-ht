const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Security Headers
const securityHeaders = helmet();

// CORS Strik
const corsOptions = cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Rate Limiter pou Auth (Login / Register / OTP) - Max 10 requêtes pa 15 minit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Twòp demann koneksyon. Tanpri tann 15 minit anvan w eseye ankò.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiter jeneral pou API - Max 100 requêtes pa 15 minit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Ou depase limit demann pou chak minit.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  securityHeaders,
  corsOptions,
  authLimiter,
  apiLimiter
};
