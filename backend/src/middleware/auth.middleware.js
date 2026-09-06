const jwt = require('jsonwebtoken');

// Verifikasyon Token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Aksè pa otorize. Token manke.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'sevis_ht_secret_key_2026', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token an pa valid oswa li ekspire.' });
    }
    req.user = user;
    next();
  });
};

// Kontwòl Wòl (Role-Based Access Control - RBAC)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Ou pa gen pèmisyon (wòl) nesesè pou fè aksyon sa a.' 
      });
    }
    next();
  };
};

// Verifikasyon Pwopriyetè Resource (Pwoteksyon IDOR / BOLA)
const verifyResourceOwnership = (paramKey = 'id') => {
  return (req, res, next) => {
    const resourceUserId = req.params[paramKey];
    
    // Si se pa pwopriyetè a epi li pa yon Admin
    if (req.user.id !== resourceUserId && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Aksè refize. Ou ka sèlman modifye oswa gade pwòp done pa w.' 
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  verifyResourceOwnership
};
