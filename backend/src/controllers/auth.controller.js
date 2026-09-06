const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Enskripsyon
const register = async (req, res) => {
  const { fullName, phone, email, password, role } = req.body;

  try {
    // Pwoteksyon VULN-05 (Mass Assignment): Moun sèlman ka enskri kòm CUSTOMER oswa PROFESSIONAL
    const allowedRoles = ['CUSTOMER', 'PROFESSIONAL'];
    const userRole = allowedRoles.includes(role) ? role : 'CUSTOMER';

    // Verifye si nimewo telefòn lan deja nan baz de done a
    const existingUser = await db.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Nimewo telefòn sa a gen yon kont deja.' });
    }

    // Hash modpas ak bcrypt (Salt = 10)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Antre itilizatè a nan baz de done a
    const newUser = await db.query(
      `INSERT INTO users (full_name, phone, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, phone, email, role, created_at`,
      [fullName, phone, email || null, passwordHash, userRole]
    );

    const user = newUser.rows[0];

    // Jenere JWT Token Sekirize
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'sevis_ht_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({
      message: 'Kont ou kreye ak siksè!',
      token,
      user
    });
  } catch (error) {
    console.error('Erè Enskripsyon:', error);
    return res.status(500).json({ error: 'Yon erè fèt sou sèvè a pandan enskripsyon an.' });
  }
};

// Koneksyon (Login)
const login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Chèche itilizatè a pa nimewo telefòn
    const result = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Nimewo telefòn oswa modpas pa korèk.' });
    }

    const user = result.rows[0];

    // Verifye si kont lan pa sispann
    if (user.account_status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Kont sa a sispann. Tanpri kontakte sipò a.' });
    }

    // Verifye Modpas la
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Nimewo telefòn oswa modpas pa korèk.' });
    }

    // Jenere Token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'sevis_ht_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      message: 'Koneksyon reyisi!',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        accountStatus: user.account_status
      }
    });
  } catch (error) {
    console.error('Erè Koneksyon:', error);
    return res.status(500).json({ error: 'Erè tekniki pandan koneksyon an.' });
  }
};

// Jwenn enfòmasyon itilizatè ki konekte a (Me)
const getMe = async (req, res) => {
  try {
    const user = await db.query(
      'SELECT id, full_name, phone, email, role, account_status, is_verified, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Itilizatè pa jwenn.' });
    }

    return res.json({ user: user.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: 'Erè pandan chajman pwofil la.' });
  }
};

module.exports = {
  register,
  login,
  getMe
};
