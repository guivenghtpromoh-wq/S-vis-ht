const SENSITIVE_KEYS = new Set([
  'password',
  'newpassword',
  'currentpassword',
  'password_hash',
  'passwordhash',
  'token',
  'accesstoken',
  'refreshtoken',
  'idtoken',
  'code',
  'otp',
  'secret',
  'two_factor_secret_enc',
  'authorization',
  'cookie',
  'pin',
]);

// Deep-copies an object replacing any secret-looking field so it can be logged or audited safely.
function redact(value, depth = 0) {
  if (depth > 5 || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  const out = {};
  for (const [key, val] of Object.entries(value)) {
    out[key] = SENSITIVE_KEYS.has(key.toLowerCase()) ? '[REDACTED]' : redact(val, depth + 1);
  }
  return out;
}

module.exports = { redact };
