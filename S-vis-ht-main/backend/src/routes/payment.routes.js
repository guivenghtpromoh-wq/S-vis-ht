const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { pool } = require('../config/db');
const { authenticateToken, verifyResourceOwnership } = require('../middleware/auth.middleware');
const { logAuditEvent } = require('../middleware/audit.middleware');
const { PAYMENT_STATUS } = require('../config/constants');

// Create payment intent
router.post(
  '/create-intent',
  authenticateToken,
  async (req, res) => {
    const { serviceRequestId } = req.body;

    try {
      if (!serviceRequestId) {
        return res.status(400).json({ error: 'Service request ID nesesè.' });
      }

      // Verify user owns this request
      const request = await pool.query(
        'SELECT * FROM service_requests WHERE id = $1 AND customer_id = $2',
        [serviceRequestId, req.user.id]
      );

      if (request.rows.length === 0) {
        return res.status(403).json({ error: 'Aksyon sa a pa otorize.' });
      }

      const serviceReq = request.rows[0];

      // Create payment transaction
      const transaction = await pool.query(
        `INSERT INTO transactions (service_request_id, customer_id, professional_id, amount, currency, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, amount, status`,
        [serviceRequestId, req.user.id, serviceReq.professional_id, serviceReq.price, 'HTG', PAYMENT_STATUS.PENDING]
      );

      // TODO: Generate MonCash payment link
      const paymentId = transaction.rows[0].id;

      return res.json({
        message: 'Intent pèman kreye',
        paymentId,
        amount: transaction.rows[0].amount,
        status: transaction.rows[0].status
      });
    } catch (error) {
      console.error('Payment intent creation error:', error);
      return res.status(500).json({ error: 'Erè pandan kreyasyon intent pèman an.' });
    }
  }
);

// Handle payment webhook
router.post(
  '/webhook/moncash',
  logAuditEvent('PAYMENT_WEBHOOK_RECEIVED'),
  async (req, res) => {
    try {
      const { transactionId, orderId, status, amount } = req.body;
      const signature = req.headers['x-moncash-signature'];

      // Verify webhook signature
      const secretKey = process.env.PAYMENT_WEBHOOK_SECRET || 'super_secret_webhook_key';
      const computedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== computedSignature) {
        console.warn('Invalid webhook signature');
        return res.status(401).json({ error: 'Signati Webhook pa valid.' });
      }

      // Fetch transaction
      const transaction = await pool.query(
        'SELECT * FROM transactions WHERE id = $1',
        [orderId]
      );

      if (transaction.rows.length === 0) {
        return res.status(404).json({ error: 'Tranzaksyon pa jwenn.' });
      }

      const txn = transaction.rows[0];

      // Verify amount matches
      if (parseFloat(txn.amount) !== parseFloat(amount)) {
        console.error('Amount mismatch in webhook');
        return res.status(400).json({ error: 'Montant pa matche.' });
      }

      // Check idempotency - don't process if already processed
      if (txn.status === PAYMENT_STATUS.COMPLETED) {
        return res.json({ message: 'Webhook deja trete.' });
      }

      // Update transaction status
      if (status === 'SUCCESSFUL') {
        await pool.query(
          `UPDATE transactions SET status = $1, provider_transaction_id = $2, completed_at = NOW()
           WHERE id = $3`,
          [PAYMENT_STATUS.COMPLETED, transactionId, orderId]
        );

        // Update service request status
        await pool.query(
          'UPDATE service_requests SET payment_status = $1 WHERE id = $2',
          [PAYMENT_STATUS.COMPLETED, txn.service_request_id]
        );

        // Log audit
        await pool.query(
          `INSERT INTO audit_logs (action, target_id, details, status_code)
           VALUES ($1, $2, $3, $4)`,
          ['PAYMENT_COMPLETED', orderId, JSON.stringify({ amount, provider: 'MonCash' }), 200]
        ).catch(err => console.error('Audit log error:', err));
      } else {
        await pool.query(
          'UPDATE transactions SET status = $1 WHERE id = $2',
          [PAYMENT_STATUS.FAILED, orderId]
        );
      }

      return res.json({ message: 'Webhook trete ak siksè.' });
    } catch (error) {
      console.error('Webhook processing error:', error);
      return res.status(500).json({ error: 'Erè pandan tretman webhook la.' });
    }
  }
);

// Get payment history
router.get(
  '/history',
  authenticateToken,
  async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(50, parseInt(req.query.limit) || 20);
      const offset = (page - 1) * limit;

      const transactions = await pool.query(
        `SELECT id, service_request_id, amount, currency, status, payment_method, created_at, completed_at
         FROM transactions
         WHERE customer_id = $1 OR professional_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [req.user.id, limit, offset]
      );

      return res.json({ transactions: transactions.rows });
    } catch (error) {
      console.error('Payment history retrieval error:', error);
      return res.status(500).json({ error: 'Erè pandan chajman istwa pèman yo.' });
    }
  }
);

module.exports = router;
