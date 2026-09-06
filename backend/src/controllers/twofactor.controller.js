const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const db = require('../config/db');

// 1. Jenerasyon Sekret ak QR Code pou Admin
const setup2FA = async (req, res) => {
  const userId = req.user.id;

  try {
    const secret = speakeasy.generateSecret({
      name: `SEVIS-HT Admin (${req.user.id})`
    });

    // Anrejistre secret la pou tanporèman nan DB anba itilizatè a
    await db.query(
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
    return res.status(500).json({ error: 'Erè pandan konfigirasyon 2FA.' });
  }
};

// 2. Valide Kòd 6 chif la pou aktive 2FA nèt
const verify2FA = async (req, res) => {
  const { token } = req.body;
  const userId = req.user.id;

  try {
    const userRes = await db.query('SELECT two_factor_secret FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];

    if (!user || !user.two_factor_secret) {
      return res.status(400).json({ error: 'Konfigirasyon 2FA pa jwenn.' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: 'base32',
      token,
      window: 1 // Permet yon moso ti decalage tan
    });

    if (verified) {
      await db.query('UPDATE users SET is_two_factor_enabled = true WHERE id = $1', [userId]);
      return res.json({ message: '2FA aktive ak siksè sou kont ou!' });
    } else {
      return res.status(400).json({ error: 'Kòd 2FA sa a pa bon oswa li ekspire.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erè pandan verifikasyon 2FA.' });
  }
};

module.exports = { setup2FA, verify2FA };
