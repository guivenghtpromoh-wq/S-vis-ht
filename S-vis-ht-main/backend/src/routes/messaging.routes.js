const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { validate, messageSchema } = require('../middleware/validation.middleware');
const messageController = require('../controllers/message.controller');

router.post('/', authenticateToken, validate(messageSchema), messageController.sendMessage);
router.get('/conversation/:otherUserId', authenticateToken, messageController.getConversation);

module.exports = router;
