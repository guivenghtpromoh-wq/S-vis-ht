const db = require('../config/db');

const logAuditEvent = async ({ userId, action, ipAddress, details = {} }) => {
  try {
    const safeDetails = { ...details };
    delete safeDetails.password;
    delete safeDetails.otp;
    delete safeDetails.token;
    delete safeDetails.code;

    await db.query(
      `INSERT INTO audit_logs (user_id, action, ip_address, details) VALUES ($1, $2, $3, $4)`,
      [userId || null, action, ipAddress || null, JSON.stringify(safeDetails)]
    );
  } catch (err) {
    console.error('Erè Audit Logging:', err.message);
  }
};

module.exports = { logAuditEvent };
