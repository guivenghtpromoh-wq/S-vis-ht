const { pool } = require('../config/db');

const logAuditEvent = (action) => {
  return async (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const actorId = req.user ? req.user.id : null;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const targetId = req.params.id || req.body.userId || null;

        // Filter sensitive fields from details
        const details = { ...req.body };
        delete details.password;
        delete details.password_hash;
        delete details.newPassword;
        delete details.token;
        delete details.otpCode;
        delete details.twoFactorSecret;

        pool.query(
          `INSERT INTO audit_logs (actor_id, action, target_id, details, ip_address, user_agent, status_code)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            actorId,
            action,
            targetId,
            JSON.stringify(details),
            ipAddress,
            req.get('user-agent'),
            res.statusCode
          ]
        ).catch(err => console.error('Audit log error:', err));
      }
      return originalJson.call(this, data);
    };
    next();
  };
};

module.exports = { logAuditEvent };
