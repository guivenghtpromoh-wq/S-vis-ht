const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
require('dotenv').config();

const authRoutes = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

// Wout Otantifikasyon
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    const result = await client.query('SELECT NOW()');
    res.json({
      status: 'OK',
      message: 'SÈVIS HT Backend sekirize ak Neon Database!',
      time: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.end();
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Sèvè SÈVIS HT ap kouri sou pòt ${PORT}`);
});
