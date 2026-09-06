const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const { Client } = require('pg');

const router = express.Router();

const getDbClient = () => {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
};

// Enskripsyon
router.post('/register', async (req, res) => {
  const { fullName, phone, email, password, role } = req.body;

  if (!fullName || !phone || !password) {
    return res.status(400).json({ error: 'Nòm, nimewo telefòn ak modpas nesesè.' });
  }

  const client = getDbClient();
  try {
    await client.connect();

    // Verification si nimewo an egziste deja
    const checkUser = await client.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Nimewo telefòn sa a deja gen yon kont.' });
    }

    // Hachaj modpas
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Enserse itilizatè nan Neon
    const newUser = await client.query(
      `INSERT INTO users (full_name, phone, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, phone, email, role, created_at`,
      [fullName, phone, email || null, passwordHash, role || 'CUSTOMER']
    );

    const user = newUser.rows[0];

    // Jenerasyon Token JWT
    const token = jwt.encode(
      { id: user.id, role: user.role, exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) },
      process.env.JWT_SECRET || 'sevis_ht_secret_key_2026'
    );

    res.status(201).json({
      message: 'Kont kreye avèk siksè!',
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.end();
  }
});

// Koneksyon
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: 'Tanpri bay nimewo telefòn ak modpas ou.' });
  }

  const client = getDbClient();
  try {
    await client.connect();

    const result = await client.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Itilizatè sa a pa egziste.' });
    }

    const user = result.rows[0];

    // Ferifikasyon modpas
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Modpas la enkòrèk.' });
    }

    const token = jwt.encode(
      { id: user.id, role: user.role, exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) },
      process.env.JWT_SECRET || 'sevis_ht_secret_key_2026'
    );

    res.json({
      message: 'Koneksyon reyisi!',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.end();
  }
});

module.exports = router;
