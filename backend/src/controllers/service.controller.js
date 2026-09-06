const db = require('../config/db');

// Kreye yon Pwofil Pwofesyonèl (Sèlman pou wòl PROFESSIONAL)
const createProfessionalProfile = async (req, res) => {
  const { title, bio, categorySlug, startingPrice } = req.body;
  const userId = req.user.id;

  try {
    const existingProfile = await db.query('SELECT id FROM professional_profiles WHERE user_id = $1', [userId]);
    if (existingProfile.rows.length > 0) {
      return res.status(400).json({ error: 'Ou gen yon pwofil pwofesyonèl kreye deja.' });
    }

    const result = await db.query(
      `INSERT INTO professional_profiles (user_id, title, bio, category_slug, starting_price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, title, bio, categorySlug, startingPrice]
    );

    return res.status(201).json({
      message: 'Pwofil pwofesyonèl kreye ak siksè!',
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Erè Kreye Pwofil:', error);
    return res.status(500).json({ error: 'Erè pandan kreyasyon pwofil pwofesyonèl la.' });
  }
};

// Liste tout sèvis piblik yo
const getAllServices = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.id, p.title, p.bio, p.category_slug, p.starting_price, p.rating, u.full_name, u.phone 
      FROM professional_profiles p
      JOIN users u ON p.user_id = u.id
      WHERE u.account_status = 'ACTIVE'
    `);
    return res.json({ services: result.rows });
  } catch (error) {
    return res.status(500).json({ error: 'Erè pandan chajman sèvis yo.' });
  }
};

// Pasaj yon Kòmand / Demann Sèvis (CUSTOMER)
const createServiceRequest = async (req, res) => {
  const { professionalId, description } = req.body;
  const customerId = req.user.id;

  try {
    const result = await db.query(
      `INSERT INTO service_requests (customer_id, professional_id, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [customerId, professionalId, description]
    );

    return res.status(201).json({
      message: 'Demann sèvis voye ak siksè!',
      request: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erè pandan kreyasyon demann sèvis la.' });
  }
};

// Li kòmand yon itilizatè (Pwoteksyon IDOR)
const getUserRequests = async (req, res) => {
  const targetUserId = req.params.userId;

  try {
    const result = await db.query(
      `SELECT r.id, r.description, r.status, r.created_at, p.title AS service_title
       FROM service_requests r
       JOIN professional_profiles p ON r.professional_id = p.id
       WHERE r.customer_id = $1`,
      [targetUserId]
    );

    return res.json({ requests: result.rows });
  } catch (error) {
    return res.status(500).json({ error: 'Erè pandan chajman kòmand yo.' });
  }
};

module.exports = {
  createProfessionalProfile,
  getAllServices,
  createServiceRequest,
  getUserRequests
};
