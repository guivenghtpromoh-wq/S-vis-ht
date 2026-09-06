const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');

// Load, in priority order, backend/.env then the Next.js project env files one level up.
// dotenv never overrides variables that are already set in the process.
for (const file of ['.env', '../.env.development.local', '../.env.local', '../.env']) {
  dotenv.config({ path: path.resolve(process.cwd(), file), quiet: true });
}

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

function required(name, { minLength = 0, devFallback } = {}) {
  const value = process.env[name];
  if (value && value.length >= minLength) return value;
  if (!isProduction && devFallback !== undefined) {
    console.warn(`[env] ${name} is missing or too short; using an ephemeral development value.`);
    return devFallback;
  }
  throw new Error(`[env] ${name} is required${minLength ? ` (min ${minLength} chars)` : ''}.`);
}

function optional(name, fallback) {
  return process.env[name] || fallback;
}

// Ephemeral secrets rotate every process start in development, so a leaked dev token is useless.
const devSecret = () => crypto.randomBytes(48).toString('base64');

const env = {
  isProduction,
  isTest,
  port: Number(optional('PORT', 4000)),
  databaseUrl: required('DATABASE_URL'),

  jwtSecret: required('JWT_SECRET', { minLength: 32, devFallback: devSecret() }),
  jwtIssuer: optional('JWT_ISSUER', 'sevis-ht'),
  jwtAudience: optional('JWT_AUDIENCE', 'sevis-ht-app'),
  accessTokenTtl: optional('ACCESS_TOKEN_TTL', '15m'),
  refreshTokenTtlDays: Number(optional('REFRESH_TOKEN_TTL_DAYS', 30)),

  // 32-byte key (base64 or hex) for AES-256-GCM encryption of TOTP secrets.
  encryptionKey: required('ENCRYPTION_KEY', {
    minLength: 32,
    devFallback: crypto.randomBytes(32).toString('base64'),
  }),

  corsOrigins: (optional('CORS_ORIGIN', '') || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  appUrl: optional('APP_URL', ''),

  paymentWebhookSecret: optional('PAYMENT_WEBHOOK_SECRET', ''),

  uploadDir: optional('UPLOAD_DIR', path.resolve(process.cwd(), 'uploads')),

  // Email OTP delivery (nodemailer SMTP)
  smtp: {
    host: optional('SMTP_HOST', ''),
    port: Number(optional('SMTP_PORT', 587)),
    user: optional('SMTP_USER', ''),
    pass: optional('SMTP_PASS', ''),
    from: optional('SMTP_FROM', 'SÈVIS HT <no-reply@sevis-ht.app>'),
  },

  // SMS OTP: Firebase Phone Auth verified server-side by checking the Firebase ID token.
  firebaseProjectId: optional('FIREBASE_PROJECT_ID', ''),

  // Non-production only: echo OTP codes in API responses so the flow can be exercised
  // without a real SMS/email provider. Hard-disabled in production below.
  otpDevEcho: !isProduction && optional('OTP_DEV_ECHO', 'false') === 'true',

  bcryptRounds: 12,
};

if (isProduction && env.corsOrigins.length === 0) {
  throw new Error('[env] CORS_ORIGIN must list the trusted frontend origin(s) in production.');
}

module.exports = env;
