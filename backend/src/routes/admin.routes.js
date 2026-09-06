const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');
const { logAuditEvent } = require('../middleware/audit.middleware');

// Sispann oswa Debloke yon kont
router.patch('/users/:id/status', 
  authenticateToken, 
  authorizeRoles('ADMIN', 'SUPER_ADMIN'), 
  logAuditEvent('USER_STATUS_CHANGE'),
  async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!['ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'].includes(status)) {
      return res.status(400).json({ error: 'Sitiyasyon (status) sa a pa valid.' });
    }

    try {
      await db.query('UPDATE users SET account_status = $1 WHERE id = $2', [status, id]);
      return res.json({ message: `Sitiyasyon kont ${id} la vin ${status}.` });
    } catch (error) {
      return res.status(500).json({ error: 'Erè pandan modifikasyon kont lan.' });
    }
  }
);

// Chanje Wòl yon itilizatè (Sèlman SUPER_ADMIN)
router.patch('/users/:id/role',
  authenticateToken,
  authorizeRoles('SUPER_ADMIN'),
  logAuditEvent('USER_ROLE_CHANGE'),
  async (req, res) => {
    const { role } = req.body;
    const { id } = req.params;

    if (!['CUSTOMER', 'PROFESSIONAL', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Wòl sa a pa eksiste.' });
    }

    try {
      await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
      return res.json({ message: `Wòl itilizatè ${id} la vin ${role}.` });
    } catch (error) {
      return res.status(500).json({ error: 'Erè pandan modifikasyon wòl la.' });
    }
  }
);

// Li tout Audit Logs (Sèlman ADMIN ak SUPER_ADMIN)
router.get('/audit-logs',
  authenticateToken,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  async (req, res) => {
    try {
      const logs = await db.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
      return res.json({ auditLogs: logs.rows });
    } catch (error) {
      return res.status(500).json({ error: 'Erè pandan rekiperasyon Audit Logs yo.' });
    }
  }
);

module.exports = router;
