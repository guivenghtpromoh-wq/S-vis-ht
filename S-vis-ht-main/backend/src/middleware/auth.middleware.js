const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/db');

// Authenticate JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Aksè pa otorize. Token manke.' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET not configured');
    return res.status(500).json({ error: 'Konfigirasyon sèvè erè.' });
  }

  try {
    // Check if token is revoked
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const revokedSession = await pool.query(
      'SELECT id FROM sessions WHERE token_hash = $1 AND revoked_at IS NOT NULL',
      [tokenHash]
    );

    if (revokedSession.rows.length > 0) {
      return res.status(401).json({ error: 'Token a pa valid. Tanpri konekte ankò.' });
    }

    // Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database to ensure they still exist and are active
    const user = await pool.query(
      'SELECT id, role, account_status FROM users WHERE id = $1',
      [decoded.id]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Itilizatè pa jwenn.' });
    }

    const userData = user.rows[0];

    // Check account status
    if (userData.account_status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Kont ou sispann.' });
    }

    if (userData.account_status === 'DELETED') {
      return res.status(403).json({ error: 'Kont ou te efase.' });
    }

    req.user = {
      id: decoded.id,
      role: userData.role
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token ekspire. Tanpri konekte ankò.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token pa valid.' });
    }
    console.error('Token verification error:', err);
    return res.status(403).json({ error: 'Token an pa valid oswa li ekspire.' });
  }
};

// Authorize based on roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Aksè pa otorize.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Ou pa gen pèmisyon (wòl) nesesè pou fè aksyon sa a.'
      });
    }
    next();
  };
};

// Verify resource ownership (IDOR protection)
const verifyResourceOwnership = (paramKey = 'id', resourceType = 'user') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramKey];

      if (!resourceId) {
        return res.status(400).json({ error: 'Resource ID manke.' });
      }

      // Allow ADMIN and SUPER_ADMIN to access any resource
      if (['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
        return next();
      }

      let isOwner = false;

      // Check ownership based on resource type
      if (resourceType === 'user') {
        isOwner = req.user.id === resourceId;
      } else if (resourceType === 'professional_profile') {
        const profile = await pool.query(
          'SELECT user_id FROM professional_profiles WHERE id = $1',
          [resourceId]
        );
        isOwner = profile.rows.length > 0 && profile.rows[0].user_id === req.user.id;
      } else if (resourceType === 'service_request') {
        const request = await pool.query(
          'SELECT customer_id, professional_id FROM service_requests WHERE id = $1',
          [resourceId]
        );
        if (request.rows.length > 0) {
          const req_data = request.rows[0];
          isOwner = req_data.customer_id === req.user.id || req_data.professional_id === req.user.id;
        }
      } else if (resourceType === 'conversation') {
        const conversation = await pool.query(
          'SELECT customer_id, professional_id FROM conversations WHERE id = $1',
          [resourceId]
        );
        isOwner = conversation.rows.length > 0 &&
          (conversation.rows[0].customer_id === req.user.id || conversation.rows[0].professional_id === req.user.id);
      } else if (resourceType === 'message') {
        const message = await pool.query(
          'SELECT sender_id FROM messages WHERE id = $1',
          [resourceId]
        );
        isOwner = message.rows.length > 0 && message.rows[0].sender_id === req.user.id;
      } else if (resourceType === 'review') {
        const review = await pool.query(
          'SELECT reviewer_id FROM reviews WHERE id = $1',
          [resourceId]
        );
        isOwner = review.rows.length > 0 && review.rows[0].reviewer_id === req.user.id;
      }

      if (!isOwner) {
        return res.status(403).json({
          error: 'Aksè refize. Ou ka sèlman modifye oswa gade pwòp done pa w.'
        });
      }

      next();
    } catch (error) {
      console.error('Resource ownership verification error:', error);
      return res.status(500).json({ error: 'Erè pandan verifye pwopriyete a.' });
    }
  };
};

// Optional: Verify admin actions with additional logging
const requireAdminConfirmation = (action) => {
  return (req, res, next) => {
    const confirmationHeader = req.headers['x-confirm-action'];
    if (confirmationHeader !== 'true') {
      return res.status(400).json({
        error: `Aksyon administretif kritik. Mete "x-confirm-action: true" nan headers.`,
        action
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  verifyResourceOwnership,
  requireAdminConfirmation
};
