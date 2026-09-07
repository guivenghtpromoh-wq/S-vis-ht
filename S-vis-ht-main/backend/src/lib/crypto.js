const crypto = require('crypto');
const env = require('../config/env');

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function randomToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString('base64url');
}

function randomNumericCode(length = 6) {
  // crypto.randomInt is uniformly distributed, unlike Math.random.
  const max = 10 ** length;
  return String(crypto.randomInt(0, max)).padStart(length, '0');
}

function timingSafeEqualString(a, b) {
  const bufA = Buffer.from(String(a ?? ''));
  const bufB = Buffer.from(String(b ?? ''));
  if (bufA.length !== bufB.length) {
    // Compare against itself to keep timing constant, then fail.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function deriveKey() {
  const raw = env.encryptionKey;
  const asBase64 = Buffer.from(raw, 'base64');
  if (asBase64.length === 32) return asBase64;
  const asHex = /^[0-9a-f]{64}$/i.test(raw) ? Buffer.from(raw, 'hex') : null;
  if (asHex) return asHex;
  // Fall back to a KDF so any sufficiently long passphrase still yields a 32-byte key.
  return crypto.scryptSync(raw, 'sevis-ht-totp', 32);
}

const KEY = deriveKey();

function encrypt(plaintext) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((b) => b.toString('base64')).join('.');
}

function decrypt(payload) {
  const [iv, tag, ciphertext] = payload.split('.').map((p) => Buffer.from(p, 'base64'));
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

module.exports = { sha256, randomToken, randomNumericCode, timingSafeEqualString, encrypt, decrypt };
