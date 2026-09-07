const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authenticateToken, authorizeRoles, verifyResourceOwnership } = require('../middleware/auth.middleware');
const { logAuditEvent } = require('../middleware/audit.middleware');
const { validateAdminUserAction } = require('../middleware/validation-admin.middleware');
const { ACCOUNT_STATUS, ROLES } = require('../config/constants');

// Suspend or activate user account (ADMIN only)
router.patch(
  '/users/:id/status',
  authenticateToken,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  validateAdminUserAction,
  logAuditEvent('USER_STATUS_CHANGED'),
  async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;

    try {
      const validStatuses = Object.values(ACCOUNT_STATUS);
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Sitiyasyon (status) sa a pa valid.' });
      }

      const result = await pool.query(
        'UPDATE users SET account_status = $1 WHERE id = $2 RETURNING id, account_status',
        [status, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Itilizatè pa jwenn.' });
      }

      return res.json({
        message: `Sitiyasyon kont ${id} la vin ${status}.`,
        user: result.rows[0]
      });
    } catch (error) {
      console.error('Admin status change error:', error);
      return res.status(500).json({ error: 'Erè pandan modifikasyon kont lan.' });
    }
  }
);

// Change user role (SUPER_ADMIN only)
router.patch(
  '/users/:id/role',
  authenticateToken,
  authorizeRoles('SUPER_ADMIN'),
  validateAdminUserAction,
  logAuditEvent('USER_ROLE_CHANGED'),
  async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
      const validRoles = Object.values(ROLES);
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Wòl sa a pa egziste.' });
      }

      const result = await pool.query(
        'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, role',
        [role, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Itilizatè pa jwenn.' });
      }

      return res.json({
        message: `Wòl itilizatè ${id} la vin ${role}.`,
        user: result.rows[0]
      });
    } catch (error) {
      console.error('Admin role change error:', error);
      return res.status(500).json({ error: 'Erè pandan modifikasyon wòl la.' });
    }
  }
);

// Get audit logs (ADMIN only)
router.get(
  '/audit-logs',
  authenticateToken,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, parseInt(req.query.limit) || 50);
      const offset = (page - 1) * limit;

      const logs = await pool.query(
        `SELECT id, actor_id, action, target_id, details, ip_address, user_agent, status_code, created_at
         FROM audit_logs
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const count = await pool.query('SELECT COUNT(*) as total FROM audit_logs');

      return res.json({
        auditLogs: logs.rows,
        pagination: {
          total: parseInt(count.rows[0].total),
          page,
          limit,
          pages: Math.ceil(parseInt(count.rows[0].total) / limit)
        }
      });
    } catch (error) {
      console.error('Audit logs retrieval error:', error);
      return res.status(500).json({ error: 'Erè pandan rekiperasyon Audit Logs yo.' });
    }
  }
);

// Get admin dashboard stats (ADMIN only)
router.get(
  '/dashboard/stats',
  authenticateToken,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  async (req, res) => {
    try {
      const users = await pool.query('SELECT COUNT(*) as count FROM users');
      const professionals = await pool.query('SELECT COUNT(*) as count FROM professional_profiles');
      const requests = await pool.query('SELECT COUNT(*) as count FROM service_requests');
      const suspended = await pool.query(
        'SELECT COUNT(*) as count FROM users WHERE account_status = $1',
        ['SUSPENDED']
      );

      return res.json({
        totalUsers: parseInt(users.rows[0].count),
        totalProfessionals: parseInt(professionals.rows[0].count),
        totalRequests: parseInt(requests.rows[0].count),
        suspendedUsers: parseInt(suspended.rows[0].count)
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return res.status(500).json({ error: 'Erè pandan chajman statistik yo.' });
    }
  }
);

module.exports = router;
