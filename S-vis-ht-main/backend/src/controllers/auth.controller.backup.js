const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { PASSWORD_REGEX, PASSWORD_REQUIREMENTS, ACCOUNT_STATUS } = require('../config/constants');

// Validate password strength
const validatePasswordStrength = (password) => {
  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      message: `Modpas la dwe gen omwen ${PASSWORD_REQUIREMENTS.MIN_LENGTH} karaktè, yon majiskil, yon miniskil, yon chif, ak yon karaktè espesyal (@$!%*?&).`
    };
  }
  return { valid: true };
};

// Hash password with Argon2id-like security (bcrypt with higher rounds)
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

// Register
const register = async (req, res) => {
  const { fullName, phone, email, password, role } = req.body;

  try {
    // Input validation
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Non an dwe gen omwen 2 karaktè.' });
    }

    const phoneRegex = /^[0-9+\s-]{8,15}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Nimewo telefòn lan pa valid.' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Modpas nesesè.' });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // Email validation if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Adrès imel la pa valid.' });
      }
    }

    // Mass assignment protection: only allow CUSTOMER or PROFESSIONAL
    const allowedRoles = ['CUSTOMER', 'PROFESSIONAL'];
    const userRole = allowedRoles.includes(role) ? role : 'CUSTOMER';

    // Check if phone already exists (generic error message for security)
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE phone = $1 OR (email IS NOT NULL AND email = $2)',
      [phone, email || null]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Nimewo telefòn oswa adrès imel sa a egziste deja.' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const newUser = await pool.query(
      `INSERT INTO users (full_name, phone, email, password_hash, role, account_status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, full_name, phone, email, role, account_status, created_at`,
      [fullName, phone, email || null, passwordHash, userRole, ACCOUNT_STATUS.ACTIVE]
    );

    const user = newUser.rows[0];

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Log audit event
    await pool.query(
      `INSERT INTO audit_logs (actor_id, action, target_id, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, 'USER_REGISTERED', user.id, req.ip, req.get('user-agent')]
    ).catch(err => console.error('Audit log error:', err));

    return res.status(201).json({
      message: 'Kont ou kreye ak siksè!',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Yon erè fèt sou sèvè a pandan enskripsyon an.' });
  }
};

// Login
const login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    if (!phone || !password) {
      return res.status(401).json({ error: 'Nimewo telefòn oswa modpas pa korèk.' });
    }

    // Fetch user with account status check
    const result = await pool.query(
      'SELECT id, full_name, phone, email, password_hash, role, account_status, failed_login_attempts, locked_until FROM users WHERE phone = $1',
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Nimewo telefòn oswa modpas pa korèk.' });
    }

    const user = result.rows[0];

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(403).json({ error: 'Kont ou bloke. Tanpri eseye ankò nan yon kèk minit.' });
    }

    // Check if account is suspended
    if (user.account_status === ACCOUNT_STATUS.SUSPENDED) {
      return res.status(403).json({ error: 'Kont sa a sispann. Tanpri kontakte sipò a.' });
    }

    if (user.account_status === ACCOUNT_STATUS.DELETED) {
      return res.status(403).json({ error: 'Kont sa a te efase.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      // Increment failed login attempts
      const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
      let lockedUntil = null;

      // Lock account after 5 failed attempts for 15 minutes
      if (newFailedAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await pool.query(
        'UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3',
        [newFailedAttempts, lockedUntil, user.id]
      );

      // Log failed attempt
      await pool.query(
        `INSERT INTO audit_logs (action, target_id, ip_address, user_agent, status_code)
         VALUES ($1, $2, $3, $4, $5)`,
        ['LOGIN_FAILED', user.id, req.ip, req.get('user-agent'), 401]
      ).catch(err => console.error('Audit log error:', err));

      return res.status(401).json({ error: 'Nimewo telefòn oswa modpas pa korèk.' });
    }

    // Reset failed login attempts on successful login
    await pool.query(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Check if 2FA is enabled
    if (user.is_two_factor_enabled) {
      // Generate temporary OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await pool.query(
        `INSERT INTO otp_tokens (user_id, otp_code, otp_type, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [user.id, otpCode, 'EMAIL', expiresAt]
      );

      // TODO: Send OTP to email via Resend API
      console.log(`OTP for user ${user.id}: ${otpCode}`);

      return res.status(200).json({
        message: 'OTP voye nan imel ou. Tanpri verifye.',
        requiresOTP: true,
        userId: user.id
      });
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Store session
    const sessionId = crypto.randomUUID();
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await pool.query(
      `INSERT INTO sessions (id, user_id, token_hash, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, $5, NOW() + INTERVAL '7 days')`,
      [sessionId, user.id, tokenHash, req.ip, req.get('user-agent')]
    );

    // Log successful login
    await pool.query(
      `INSERT INTO audit_logs (actor_id, action, ip_address, user_agent, status_code)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, 'LOGIN_SUCCESS', req.ip, req.get('user-agent'), 200]
    ).catch(err => console.error('Audit log error:', err));

    return res.json({
      message: 'Koneksyon reyisi!',
      token,
      sessionId,
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Erè tekniki pandan koneksyon an.' });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT id, full_name, phone, email, role, account_status, is_verified, is_two_factor_enabled, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Itilizatè pa jwenn.' });
    }

    return res.json({ user: user.rows[0] });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ error: 'Erè pandan chajman pwofil la.' });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      await pool.query(
        'UPDATE sessions SET revoked_at = NOW() WHERE token_hash = $1',
        [tokenHash]
      );
    }

    await pool.query(
      `INSERT INTO audit_logs (actor_id, action, ip_address, user_agent)
       VALUES ($1, $2, $3, $4)`,
      [req.user.id, 'LOGOUT', req.ip, req.get('user-agent')]
    ).catch(err => console.error('Audit log error:', err));

    return res.json({ message: 'Ou te dekonekte avèk siksè.' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Erè pandan dekoneksyon an.' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  validatePasswordStrength,
  hashPassword
};
