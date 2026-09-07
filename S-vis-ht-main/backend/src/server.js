require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const securityMiddleware = require('./middleware/security.middleware') || {};
const { errorHandler } = require('./middleware/error.middleware') || {};
const apiRoutes = require('./routes/api.routes');

const app = express();

// Middlewares
if (securityMiddleware.helmetMiddleware) app.use(securityMiddleware.helmetMiddleware);
if (securityMiddleware.corsMiddleware) app.use(securityMiddleware.corsMiddleware);
if (securityMiddleware.generalLimiter) app.use(securityMiddleware.generalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Healthcheck Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Mounting API Routes
if (apiRoutes) {
  app.use('/api/v1', apiRoutes);
}

// Error Handler
if (typeof errorHandler === 'function') {
  app.use(errorHandler);
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Erè Sèvè' });
  });
}

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running safely on port ${PORT}`);
  });
}

module.exports = app;
