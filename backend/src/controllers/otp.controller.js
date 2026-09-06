const { pool } = require('../config/db');
const crypto = require('crypto');
const { OTP_CONFIG } = require('../config/constants');

// Verify OTP during 2FA login
const verifyOTP = async (req, res) => {
  const { userId, otpCode } = req.body;

  try {
    if (!userId || !otpCode) {
      return res.status(400).json({ error: 'User ID ak OTP kod nesesè.' });
    }

    if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
      return res.status(400).json({ error: 'OTP kod la dwe gen 6 chif.' });
    }

    // Find valid OTP
    const otpResult = await pool.query(
      `SELECT id, attempts FROM otp_tokens
       WHERE user_id = $1 AND otp_code = $2 AND expires_at > NOW() AND verified_at IS NULL`,
      [userId, otpCode]
    );

    if (otpResult.rows.length === 0) {
      // Check if too many attempts
      const attemptResult = await pool.query(
        `SELECT attempts FROM otp_tokens
         WHERE user_id = $1 AND expires_at > NOW()
         ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );

      if (attemptResult.rows.length > 0 && attemptResult.rows[0].attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
        return res.status(429).json({ error: 'Twòp tantativ. OTP ekspire.' });
      }

      // Increment attempts
      await pool.query(
        `UPDATE otp_tokens SET attempts = attempts + 1
         WHERE user_id = $1 AND expires_at > NOW() AND verified_at IS NULL
         ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );

      return res.status(400).json({ error: 'OTP kod la pa bon.' });
    }

    const otpId = otpResult.rows[0].id;

    // Mark OTP as verified
    await pool.query(
      'UPDATE otp_tokens SET verified_at = NOW() WHERE id = $1',
      [otpId]
    );

    // Generate session token
    const user = await pool.query(
      'SELECT id, role FROM users WHERE id = $1',
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Itilizatè pa jwenn.' });
    }

    const jwt = require('jsonwebtoken');
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Log successful verification
    await pool.query(
      `INSERT INTO audit_logs (actor_id, action, ip_address, user_agent, status_code)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'OTP_VERIFIED', req.ip, req.get('user-agent'), 200]
    ).catch(err => console.error('Audit log error:', err));

    return res.json({
      message: 'OTP verifye ak siksè!',
      token,
      user: {
        id: user.rows[0].id,
        role: user.rows[0].role
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ error: 'Erè pandan verifikasyon OTP.' });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ error: 'User ID nesesè.' });
    }

    // Check rate limiting: max 3 resend attempts per 10 minutes
    const recentOTP = await pool.query(
      `SELECT COUNT(*) as count FROM otp_tokens
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '10 minutes'`,
      [userId]
    );

    if (parseInt(recentOTP.rows[0].count) >= 3) {
      return res.status(429).json({ error: 'Twòp demann OTP. Tanpri tann.' });
    }

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_CONFIG.EXPIRATION_MINUTES * 60 * 1000);

    await pool.query(
      `INSERT INTO otp_tokens (user_id, otp_code, otp_type, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [userId, otpCode, 'EMAIL', expiresAt]
    );

    // TODO: Send OTP via email
    console.log(`Resent OTP for user ${userId}: ${otpCode}`);

    return res.json({ message: 'OTP voye ankò nan imel ou.' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({ error: 'Erè pandan ranvwaye OTP.' });
  }
};

module.exports = {
  verifyOTP,
  resendOTP
};
