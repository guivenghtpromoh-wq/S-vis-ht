const db = require('../config/db');

const logAuditEvent = (action) => {
  return async (req, res, next) => {
    // Sove referans sou repons orijinal la pou nou ka anregistre apre requêt la fin reponn
    const originalJson = res.json;
    res.json = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const actorId = req.user ? req.user.id : null;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const targetId = req.params.id || req.body.userId || null;

        db.query(
          `INSERT INTO audit_logs (actor_id, action, target_id, details, ip_address)
           VALUES ($1, $2, $3, $4, $5)`,
          [actorId, action, targetId, JSON.stringify(req.body), ipAddress]
        ).catch(err => console.error('Erè pandan anrejistreman Audit Log:', err));
      }
      return originalJson.call(this, data);
    };
    next();
  };
};

module.exports = { logAuditEvent };
