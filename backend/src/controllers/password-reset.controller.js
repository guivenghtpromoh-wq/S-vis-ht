const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { pool } = require('../config/db');
const { PASSWORD_REGEX, PASSWORD_REQUIREMENTS, PASSWORD_RESET_CONFIG } = require('../config/constants');
const { hashPassword, validatePasswordStrength } = require('./auth.controller');

// Request password reset
const requestPasswordReset = async (req, res) => {
  const { phone } = req.body;

  try {
    if (!phone) {
      // Generic error to prevent user enumeration
      return res.status(200).json({
        message: 'Si nimewo telefòn sa a egziste, yon imel ba reset yo voye.'
      });
    }

    const user = await pool.query('SELECT id, email FROM users WHERE phone = $1', [phone]);

    if (user.rows.length === 0) {
      // Don't reveal user doesn't exist
      return res.status(200).json({
        message: 'Si nimewo telefòn sa a egziste, yon imel ba reset yo voye.'
      });
    }

    const userData = user.rows[0];

    if (!userData.email) {
      return res.status(400).json({
        error: 'Okenn adrès imel asosye ak kont sa a. Tanpri kontakte sipò.'
      });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_CONFIG.EXPIRATION_MINUTES * 60 * 1000);

    // Invalidate previous tokens
    await pool.query(
      'DELETE FROM password_reset_tokens WHERE user_id = $1',
      [userData.id]
    );

    // Store token hash
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, ip_address)
       VALUES ($1, $2, $3, $4)`,
      [userData.id, tokenHash, expiresAt, req.ip]
    );

    // TODO: Send email with reset link
    // const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    console.log(`Password reset token for ${userData.email}: ${resetToken}`);

    // Log audit event
    await pool.query(
      `INSERT INTO audit_logs (action, target_id, ip_address, user_agent)
       VALUES ($1, $2, $3, $4)`,
      ['PASSWORD_RESET_REQUESTED', userData.id, req.ip, req.get('user-agent')]
    ).catch(err => console.error('Audit log error:', err));

    return res.status(200).json({
      message: 'Si nimewo telefòn sa a egziste, yon imel ba reset yo voye.'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({ error: 'Erè pandan demann reset modpas la.' });
  }
};

// Verify reset token and reset password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token ak modpas nesesè.' });
    }

    // Validate new password
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // Hash token to find it
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid token
    const resetTokenResult = await pool.query(
      `SELECT user_id FROM password_reset_tokens
       WHERE token_hash = $1 AND expires_at > NOW() AND used_at IS NULL`,
      [tokenHash]
    );

    if (resetTokenResult.rows.length === 0) {
      return res.status(400).json({ error: 'Token sa a pa valid oswa li ekspire.' });
    }

    const userId = resetTokenResult.rows[0].user_id;

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password and invalidate token
    await pool.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2`,
      [passwordHash, userId]
    );

    await pool.query(
      `UPDATE password_reset_tokens SET used_at = NOW() WHERE token_hash = $1`,
      [tokenHash]
    );

    // Invalidate all sessions for this user
    await pool.query(
      'UPDATE sessions SET revoked_at = NOW() WHERE user_id = $1',
      [userId]
    );

    // Log audit event
    await pool.query(
      `INSERT INTO audit_logs (actor_id, action, ip_address, user_agent)
       VALUES ($1, $2, $3, $4)`,
      [userId, 'PASSWORD_RESET_COMPLETED', req.ip, req.get('user-agent')]
    ).catch(err => console.error('Audit log error:', err));

    return res.json({ message: 'Modpas ou reset ak siksè! Tanpri konekte ankò.' });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ error: 'Erè pandan reset modpas la.' });
  }
};

module.exports = {
  requestPasswordReset,
  resetPassword
};
