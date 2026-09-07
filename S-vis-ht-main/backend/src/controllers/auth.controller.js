const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { pool } = require('../config/db');
const {
  PASSWORD_REGEX,
  PASSWORD_REQUIREMENTS,
  ACCOUNT_STATUS,
} = require('../config/constants');

/**
 * Retire espas ki pa nesesè nan done tèks.
 */
const cleanText = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

/**
 * Netwaye nimewo telefòn lan.
 * Nou konsève +, chif, espas ak tire pou pa kraze nimewo ki deja nan database.
 */
const cleanPhone = (value) => {
  return cleanText(value).replace(/\s+/g, ' ');
};

/**
 * Netwaye imel.
 */
const cleanEmail = (value) => {
  const email = cleanText(value).toLowerCase();
  return email || null;
};

/**
 * Verifye fòs modpas.
 */
const validatePasswordStrength = (password) => {
  if (typeof password !== 'string' || !PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      message:
        `Modpas la dwe gen omwen ${PASSWORD_REQUIREMENTS.MIN_LENGTH} ` +
        'karaktè, yon majiskil, yon miniskil, yon chif, ' +
        'ak yon karaktè espesyal (@$!%*?&).',
    };
  }

  return { valid: true };
};

/**
 * Hash modpas la.
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

/**
 * Kreye JWT.
 */
const createAccessToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

/**
 * Kreye hash token pou sessions database.
 */
const createTokenHash = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

/**
 * Ekri yon audit log san bloke repons API a si audit log la echwe.
 */
const writeAuditLog = async ({
  actorId = null,
  action,
  targetId = null,
  ipAddress = null,
  userAgent = null,
  statusCode = null,
}) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs
        (actor_id, action, target_id, ip_address, user_agent, status_code)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        actorId,
        action,
        targetId,
        ipAddress,
        userAgent,
        statusCode,
      ]
    );
  } catch (error) {
    console.error('Audit log error:', error.message);
  }
};

/**
 * Verifye si yon nimewo telefòn lan gen bon fòma.
 */
const isValidPhone = (phone) => {
  return /^[0-9+\s-]{8,15}$/.test(phone);
};

/**
 * Verifye imel.
 */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Register.
 */
const register = async (req, res) => {
  const fullName = cleanText(req.body?.fullName);
  const phone = cleanPhone(req.body?.phone);
  const email = cleanEmail(req.body?.email);
  const password = req.body?.password;
  const requestedRole = cleanText(req.body?.role).toUpperCase();

  try {
    if (!fullName || fullName.length < 2) {
      return res.status(400).json({
        error: 'Non an dwe gen omwen 2 karaktè.',
      });
    }

    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({
        error: 'Nimewo telefòn lan pa valid.',
      });
    }

    if (!password) {
      return res.status(400).json({
        error: 'Modpas nesesè.',
      });
    }

    const passwordValidation = validatePasswordStrength(password);

    if (!passwordValidation.valid) {
      return res.status(400).json({
        error: passwordValidation.message,
      });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        error: 'Adrès imel la pa valid.',
      });
    }

    const allowedRoles = ['CUSTOMER', 'PROFESSIONAL'];
    const role = allowedRoles.includes(requestedRole)
      ? requestedRole
      : 'CUSTOMER';

    const existingUser = await pool.query(
      `SELECT id
       FROM users
       WHERE phone = $1
          OR ($2::text IS NOT NULL AND email = $2)`,
      [phone, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'Nimewo telefòn oswa adrès imel sa a egziste deja.',
      });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await pool.query(
      `INSERT INTO users
        (
          full_name,
          phone,
          email,
          password_hash,
          role,
          account_status
        )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING
          id,
          full_name,
          phone,
          email,
          role,
          account_status,
          is_verified,
          is_two_factor_enabled,
          created_at`,
      [
        fullName,
        phone,
        email,
        passwordHash,
        role,
        ACCOUNT_STATUS.ACTIVE,
      ]
    );

    const user = newUser.rows[0];
    const token = createAccessToken(user);
    const sessionId = crypto.randomUUID();
    const tokenHash = createTokenHash(token);

    await pool.query(
      `INSERT INTO sessions
        (
          id,
          user_id,
          token_hash,
          ip_address,
          user_agent,
          expires_at
        )
       VALUES
        ($1, $2, $3, $4, $5, NOW() + INTERVAL '7 days')`,
      [
        sessionId,
        user.id,
        tokenHash,
        req.ip,
        req.get('user-agent') || null,
      ]
    );

    await writeAuditLog({
      actorId: user.id,
      action: 'USER_REGISTERED',
      targetId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || null,
      statusCode: 201,
    });

    return res.status(201).json({
      message: 'Kont ou kreye ak siksè.',
      token,
      sessionId,
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        accountStatus: user.account_status,
        isVerified: user.is_verified,
        isTwoFactorEnabled: user.is_two_factor_enabled,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Nimewo telefòn oswa adrès imel sa a egziste deja.',
      });
    }

    return res.status(500).json({
      error: 'Yon erè fèt sou sèvè a pandan enskripsyon an.',
    });
  }
};

/**
 * Login.
 *
 * Kounya login lan sipòte nimewo telefòn.
 * Frontend lan dwe voye:
 * {
 *   phone: "+509XXXXXXXX",
 *   password: "ModpasFò@123"
 * }
 */
const login = async (req, res) => {
  const phone = cleanPhone(req.body?.phone);
  const password = req.body?.password;

  try {
    if (!phone || !password) {
      return res.status(401).json({
        error: 'Nimewo telefòn oswa modpas pa korèk.',
      });
    }

    const result = await pool.query(
      `SELECT
         id,
         full_name,
         phone,
         email,
         password_hash,
         role,
         account_status,
         is_verified,
         is_two_factor_enabled,
         failed_login_attempts,
         locked_until
       FROM users
       WHERE phone = $1
       LIMIT 1`,
      [phone]
    );

    if (result.rows.length === 0) {
      await writeAuditLog({
        action: 'LOGIN_FAILED',
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || null,
        statusCode: 401,
      });

      return res.status(401).json({
        error: 'Nimewo telefòn oswa modpas pa korèk.',
      });
    }

    const user = result.rows[0];

    if (
      user.locked_until &&
      new Date(user.locked_until).getTime() > Date.now()
    ) {
      return res.status(403).json({
        error:
          'Kont ou bloke. Tanpri eseye ankò nan yon kèk minit.',
      });
    }

    if (user.account_status === ACCOUNT_STATUS.SUSPENDED) {
      return res.status(403).json({
        error:
          'Kont sa a sispann. Tanpri kontakte sipò a.',
      });
    }

    if (user.account_status === ACCOUNT_STATUS.DELETED) {
      return res.status(403).json({
        error: 'Kont sa a te efase.',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      const failedAttempts =
        Number(user.failed_login_attempts || 0) + 1;

      const lockedUntil =
        failedAttempts >= 5
          ? new Date(Date.now() + 15 * 60 * 1000)
          : null;

      await pool.query(
        `UPDATE users
         SET
           failed_login_attempts = $1,
           locked_until = $2
         WHERE id = $3`,
        [
          failedAttempts,
          lockedUntil,
          user.id,
        ]
      );

      await writeAuditLog({
        actorId: user.id,
        action: 'LOGIN_FAILED',
        targetId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || null,
        statusCode: 401,
      });

      return res.status(401).json({
        error: 'Nimewo telefòn oswa modpas pa korèk.',
      });
    }

    await pool.query(
      `UPDATE users
       SET
         failed_login_attempts = 0,
         locked_until = NULL,
         last_login_at = NOW()
       WHERE id = $1`,
      [user.id]
    );

    /*
     * Si 2FA aktive, kreye yon OTP tanporè.
     * Voye OTP a dwe fèt nan otp.controller.js.
     */
    if (user.is_two_factor_enabled === true) {
      const otpCode = String(
        Math.floor(100000 + Math.random() * 900000)
      );

      const expiresAt = new Date(
        Date.now() + 10 * 60 * 1000
      );

      await pool.query(
        `DELETE FROM otp_tokens
         WHERE user_id = $1
           AND otp_type = 'EMAIL'`,
        [user.id]
      );

      await pool.query(
        `INSERT INTO otp_tokens
          (
            user_id,
            otp_code,
            otp_type,
            expires_at
          )
         VALUES ($1, $2, $3, $4)`,
        [
          user.id,
          otpCode,
          'EMAIL',
          expiresAt,
        ]
      );

      /*
       * Tanporèman, OTP la parèt nan log backend lan.
       * Sa dwe ranplase ak sendOTPEmail() anvan production.
       */
      console.log(
        `[OTP DEV ONLY] User ${user.id}: ${otpCode}`
      );

      await writeAuditLog({
        actorId: user.id,
        action: 'OTP_LOGIN_REQUESTED',
        targetId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || null,
        statusCode: 200,
      });

      return res.status(200).json({
        message: 'OTP voye nan imel ou. Tanpri verifye.',
        requiresOTP: true,
        userId: user.id,
      });
    }

    const token = createAccessToken(user);
    const sessionId = crypto.randomUUID();
    const tokenHash = createTokenHash(token);

    await pool.query(
      `INSERT INTO sessions
        (
          id,
          user_id,
          token_hash,
          ip_address,
          user_agent,
          expires_at
        )
       VALUES
        ($1, $2, $3, $4, $5, NOW() + INTERVAL '7 days')`,
      [
        sessionId,
        user.id,
        tokenHash,
        req.ip,
        req.get('user-agent') || null,
      ]
    );

    await writeAuditLog({
      actorId: user.id,
      action: 'LOGIN_SUCCESS',
      targetId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || null,
      statusCode: 200,
    });

    return res.status(200).json({
      message: 'Koneksyon reyisi.',
      token,
      sessionId,
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        accountStatus: user.account_status,
        isVerified: user.is_verified,
        isTwoFactorEnabled: user.is_two_factor_enabled,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      error: 'Erè tekniki pandan koneksyon an.',
    });
  }
};

/**
 * Retounen pwofil itilizatè ki konekte a.
 */
const getMe = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: 'Sesyon itilizatè a pa valid.',
      });
    }

    const result = await pool.query(
      `SELECT
         id,
         full_name,
         phone,
         email,
         role,
         account_status,
         is_verified,
         is_two_factor_enabled,
         created_at,
         last_login_at
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Itilizatè pa jwenn.',
      });
    }

    const user = result.rows[0];

    return res.status(200).json({
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        accountStatus: user.account_status,
        isVerified: user.is_verified,
        isTwoFactorEnabled: user.is_two_factor_enabled,
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at,
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);

    return res.status(500).json({
      error: 'Erè pandan chajman pwofil la.',
    });
  }
};

/**
 * Logout.
 */

/**
 * Logout.
 */
const logout = async (req, res) => {
  try {
    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ')
      ? authorization.substring(7)
      : null;

    if (token) {
      const tokenHash = createTokenHash(token);

      await pool.query(
        `UPDATE sessions
         SET revoked_at = NOW()
         WHERE token_hash = $1
           AND revoked_at IS NULL`,
        [tokenHash]
      );
    }

    await writeAuditLog({
      actorId: req.user?.id || null,
      action: 'LOGOUT',
      targetId: req.user?.id || null,
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || null,
      statusCode: 200,
    });

    return res.status(200).json({
      message: 'Ou te dekonekte avèk siksè.',
    });
  } catch (error) {
    console.error('Logout error:', error);

    return res.status(500).json({
      error: 'Erè pandan dekoneksyon an.',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  validatePasswordStrength,
  hashPassword,
};
