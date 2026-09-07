const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const serviceRoutes = require('./service.routes');
const messagingRoutes = require('./messaging.routes');

// Sèvi ak try-catch / fallbacks pou evite rout ki undefined
if (authRoutes) router.use('/auth', authRoutes);
if (serviceRoutes) router.use('/services', serviceRoutes);
if (messagingRoutes) router.use('/messages', messagingRoutes);

module.exports = router;
