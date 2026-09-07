const { pool } = require('../config/db');
const { verifyResourceOwnership } = require('./auth.middleware');

// Validate admin action on user
const validateAdminUserAction = async (req, res, next) => {
  const { id } = req.params;
  const { status, role } = req.body;

  try {
    // Fetch user
    const user = await pool.query('SELECT id, role FROM users WHERE id = $1', [id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Itilizatè pa jwenn.' });
    }

    // Prevent privilege escalation: can't promote to higher role than self
    const roleHierarchy = { CUSTOMER: 0, PROFESSIONAL: 1, MODERATOR: 2, ADMIN: 3, SUPER_ADMIN: 4 };
    const currentUserRank = roleHierarchy[req.user.role] || 0;
    const targetRank = roleHierarchy[role] || 0;

    if (targetRank > currentUserRank) {
      return res.status(403).json({ error: 'Ou pa ka promosyon itilizatè a pi wo pase wòl ou.' });
    }

    // Prevent self-demotion if SUPER_ADMIN
    if (req.user.id === id && req.user.role === 'SUPER_ADMIN' && role !== 'SUPER_ADMIN') {
      return res.status(400).json({ error: 'Ou pa ka demosyon w pa kont ou.' });
    }

    next();
  } catch (error) {
    console.error('Admin action validation error:', error);
    return res.status(500).json({ error: 'Erè pandan validasyon aksyon an.' });
  }
};

module.exports = { validateAdminUserAction };
