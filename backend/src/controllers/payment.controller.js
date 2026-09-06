const crypto = require('crypto');
const db = require('../config/db');

// Traitement Webhook Pèman Sekirize
const handleMonCashWebhook = async (req, res) => {
  const secretKey = process.env.PAYMENT_WEBHOOK_SECRET || 'super_secret_webhook_key';
  const signature = req.headers['x-moncash-signature'];

  // 1. Verifikasyon Signati Webhook pou asire done yo soti nan MonCash vrèman
  const computedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== computedSignature) {
    return res.status(401).json({ error: 'Signati Webhook pa valid. Aksè refize.' });
  }

  const { transactionId, orderId, status, amount } = req.body;

  try {
    // 2. Verifikasyon Idempotency ak Pri anndan baz de done
    const orderRes = await db.query('SELECT starting_price FROM service_requests WHERE id = $1', [orderId]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: 'Kòmand sa a pa eksiste.' });
    }

    // 3. Mete jou sitiyasyon pèman an sèlman si li KOIPI
    if (status === 'SUCCESSFUL') {
      await db.query(
        `UPDATE service_requests SET status = 'ACCEPTED' WHERE id = $1`,
        [orderId]
      );
    }

    return res.json({ message: 'Webhook trete ak siksè.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erè pandan tretman pèman an.' });
  }
};

module.exports = { handleMonCashWebhook };
