const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { pool } = require('../config/db');

const setup2FA = async (req, res) => {
  const userId = req.user.id;

  try {
    const secret = speakeasy.generateSecret({
      name: `SEVIS-HT Admin (${userId})`
    });

    await pool.query(
      'UPDATE users SET two_factor_secret = $1, is_two_factor_enabled = false WHERE id = $2',
      [secret.base32, userId]
    );

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    return res.json({
      message: 'Scanne QR Code sa a nan aplikasyon Google Authenticator ou an.',
      qrCodeUrl,
      secret: secret.base32
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return res.status(500).json({ error: 'Erè pandan konfigirasyon 2FA.' });
  }
};

const verify2FA = async (req, res) => {
  const { token } = req.body;
  const userId = req.user.id;

  try {
    if (!token || token.length !== 6 || !/^\d+$/.test(token)) {
      return res.status(400).json({ error: 'Kòd 2FA sa a pa valid.' });
    }

    const userRes = await pool.query(
      'SELECT two_factor_secret FROM users WHERE id = $1',
      [userId]
    );

    if (userRes.rows.length === 0 || !userRes.rows[0].two_factor_secret) {
      return res.status(400).json({ error: 'Konfigirasyon 2FA pa jwenn.' });
    }

    const verified = speakeasy.totp.verify({
      secret: userRes.rows[0].two_factor_secret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (verified) {
      await pool.query(
        'UPDATE users SET is_two_factor_enabled = true WHERE id = $1',
        [userId]
      );

      return res.json({ message: '2FA aktive ak siksè sou kont ou!' });
    } else {
      return res.status(400).json({ error: 'Kòd 2FA sa a pa bon oswa li ekspire.' });
    }
  } catch (error) {
    console.error('2FA verification error:', error);
    return res.status(500).json({ error: 'Erè pandan verifikasyon 2FA.' });
  }
};

const disable2FA = async (req, res) => {
  const userId = req.user.id;

  try {
    await pool.query(
      'UPDATE users SET is_two_factor_enabled = false, two_factor_secret = NULL WHERE id = $1',
      [userId]
    );

    return res.json({ message: '2FA dezaktive.' });
  } catch (error) {
    console.error('2FA disable error:', error);
    return res.status(500).json({ error: 'Erè pandan dezaktive 2FA.' });
  }
};

module.exports = { setup2FA, verify2FA, disable2FA };
