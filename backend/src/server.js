const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const {
  securityHeaders,
  corsOptions,
  generalLimiter
} = require('./middleware/security.middleware');

const authRoutes = require('./routes/auth.routes');
const twoFactorRoutes = require('./routes/2fa.routes');
const serviceRoutes = require('./routes/service.routes');
const adminRoutes = require('./routes/admin.routes');
const messagingRoutes = require('./routes/messaging.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

app.set('trust proxy', 1);
app.use(securityHeaders);
app.use(corsOptions);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(generalLimiter);

app.get('/api/health', (req, res) => {
  return res.json({
    status: 'OK',
    message: 'SEVIS HT Backend sekirize ak Neon Database!',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/uploads', express.static('uploads'));

app.use((req, res) => {
  return res.status(404).json({ error: 'Endpoint sa a pa egziste.' });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err);

  if (err.message === 'CORS not allowed') {
    return res.status(403).json({ error: 'CORS pa otorize.' });
  }

  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: 'JSON pa valid.' });
  }

  return res.status(500).json({
    error: 'Yon erè fèt sou sèvè a.',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Sèvè SEVIS HT ap kouri sou pòt ${PORT}`);
  console.log(`Sekirite: CORS, Helmet, Rate Limiting aktif`);
});

module.exports = app;
