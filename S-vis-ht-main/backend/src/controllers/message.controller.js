const db = require('../config/db');
const { logAuditEvent } = require('../services/audit.service');

const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Ou pa ka voye yon mesaj bay tèt ou.' });
    }

    const receiverCheck = await db.query('SELECT id FROM users WHERE id = $1 AND is_active = TRUE', [receiverId]);
    if (receiverCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Moun k ap resevwa mesaj la pa egziste.' });
    }

    const result = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [senderId, receiverId, content]
    );

    await logAuditEvent({ userId: senderId, action: 'MESSAGE_SENT', ipAddress: req.ip, details: { receiverId } });
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const getConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const result = await db.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [userId, otherUserId]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendMessage,
  getConversation,
};
