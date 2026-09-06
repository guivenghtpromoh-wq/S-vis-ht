const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authenticateToken, verifyResourceOwnership } = require('../middleware/auth.middleware');
const { messageLimiter } = require('../middleware/security.middleware');
const { sanitizeInput } = require('../middleware/validation.middleware');
const { logAuditEvent } = require('../middleware/audit.middleware');

// Get conversations
router.get(
  '/conversations',
  authenticateToken,
  async (req, res) => {
    try {
      const conversations = await pool.query(
        `SELECT c.id, c.customer_id, c.professional_id, c.last_message_at,
                u1.full_name as customer_name, u2.full_name as professional_name
         FROM conversations c
         JOIN users u1 ON c.customer_id = u1.id
         JOIN users u2 ON c.professional_id = u2.id
         WHERE c.customer_id = $1 OR c.professional_id = $1
         ORDER BY c.last_message_at DESC`,
        [req.user.id]
      );

      return res.json({ conversations: conversations.rows });
    } catch (error) {
      console.error('Conversations retrieval error:', error);
      return res.status(500).json({ error: 'Erè pandan chajman konversasyon yo.' });
    }
  }
);

// Get conversation messages (IDOR protected)
router.get(
  '/conversation/:id/messages',
  authenticateToken,
  verifyResourceOwnership('id', 'conversation'),
  async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(50, parseInt(req.query.limit) || 20);
      const offset = (page - 1) * limit;

      const messages = await pool.query(
        `SELECT m.id, m.sender_id, m.content, m.is_read, m.created_at,
                u.full_name as sender_name
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE m.conversation_id = $1
         ORDER BY m.created_at DESC
         LIMIT $2 OFFSET $3`,
        [req.params.id, limit, offset]
      );

      return res.json({ messages: messages.rows });
    } catch (error) {
      console.error('Messages retrieval error:', error);
      return res.status(500).json({ error: 'Erè pandan chajman mesaj yo.' });
    }
  }
);

// Send message (Rate limited)
router.post(
  '/conversation/:id/message',
  authenticateToken,
  verifyResourceOwnership('id', 'conversation'),
  messageLimiter,
  sanitizeInput,
  logAuditEvent('MESSAGE_SENT'),
  async (req, res) => {
    try {
      const { content } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Mesaj la pa ka vid.' });
      }

      if (content.length > 5000) {
        return res.status(400).json({ error: 'Mesaj la twòp long.' });
      }

      const message = await pool.query(
        `INSERT INTO messages (conversation_id, sender_id, content)
         VALUES ($1, $2, $3)
         RETURNING id, sender_id, content, created_at`,
        [req.params.id, req.user.id, content]
      );

      return res.status(201).json({ message: message.rows[0] });
    } catch (error) {
      console.error('Message creation error:', error);
      return res.status(500).json({ error: 'Erè pandan vwayaj mesaj la.' });
    }
  }
);

// Mark message as read
router.patch(
  '/message/:id/read',
  authenticateToken,
  async (req, res) => {
    try {
      const message = await pool.query(
        'UPDATE messages SET is_read = true, read_at = NOW() WHERE id = $1 RETURNING id, is_read',
        [req.params.id]
      );

      if (message.rows.length === 0) {
        return res.status(404).json({ error: 'Mesaj pa jwenn.' });
      }

      return res.json({ message: message.rows[0] });
    } catch (error) {
      console.error('Mark message read error:', error);
      return res.status(500).json({ error: 'Erè pandan mache mesaj yo.' });
    }
  }
);

module.exports = router;
