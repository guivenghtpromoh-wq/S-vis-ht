const { pool } = require('../config/db');
const { SERVICE_STATUS } = require('../config/constants');

const createProfessionalProfile = async (req, res) => {
  const { title, bio, categorySlug, startingPrice } = req.body;
  const userId = req.user.id;

  try {
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Tit pwofil la nesesè.' });
    }

    if (title.length > 255) {
      return res.status(400).json({ error: 'Tit la twòp long.' });
    }

    if (!categorySlug) {
      return res.status(400).json({ error: 'Kategori nesesè.' });
    }

    if (!startingPrice || parseFloat(startingPrice) <= 0) {
      return res.status(400).json({ error: 'Pri inisyal la dwe ètre pi gwo pase zéro.' });
    }

    const existingProfile = await pool.query(
      'SELECT id FROM professional_profiles WHERE user_id = $1',
      [userId]
    );

    if (existingProfile.rows.length > 0) {
      return res.status(400).json({ error: 'Ou gen yon pwofil pwofesyonèl kreye deja.' });
    }

    const result = await pool.query(
      `INSERT INTO professional_profiles (user_id, title, bio, category_slug, starting_price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, title, bio, category_slug, starting_price, rating, created_at`,
      [userId, title, bio || null, categorySlug, parseFloat(startingPrice)]
    );

    return res.status(201).json({
      message: 'Pwofil pwofesyonèl kreye ak siksè!',
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Create professional profile error:', error);
    return res.status(500).json({ error: 'Erè pandan kreyasyon pwofil pwofesyonèl la.' });
  }
};

const getProfessionalProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await pool.query(
      `SELECT p.id, p.user_id, p.title, p.bio, p.category_slug, p.starting_price, p.rating, p.verification_status,
              u.full_name, u.phone
       FROM professional_profiles p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1 AND u.account_status = 'ACTIVE'`,
      [id]
    );

    if (profile.rows.length === 0) {
      return res.status(404).json({ error: 'Pwofil pa jwenn.' });
    }

    return res.json({ profile: profile.rows[0] });
  } catch (error) {
    console.error('Get professional profile error:', error);
    return res.status(500).json({ error: 'Erè pandan chajman pwofil la.' });
  }
};

const updateProfessionalProfile = async (req, res) => {
  const { id } = req.params;
  const { title, bio, categorySlug, startingPrice, isAvailable } = req.body;

  try {
    const updates = {};
    if (title !== undefined) {
      if (title.trim().length < 2) {
        return res.status(400).json({ error: 'Tit la dwe gen omwen 2 karaktè.' });
      }
      updates.title = title;
    }
    if (bio !== undefined) {
      updates.bio = bio;
    }
    if (categorySlug !== undefined) {
      updates.category_slug = categorySlug;
    }
    if (startingPrice !== undefined) {
      if (parseFloat(startingPrice) <= 0) {
        return res.status(400).json({ error: 'Pri a dwe pi gwo pase zéro.' });
      }
      updates.starting_price = parseFloat(startingPrice);
    }
    if (isAvailable !== undefined) {
      updates.is_available = isAvailable;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Enpòtan anyen pou mete ajou.' });
    }

    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    values.push(id);

    const result = await pool.query(
      `UPDATE professional_profiles SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pwofil pa jwenn.' });
    }

    return res.json({
      message: 'Pwofil mete ajou ak siksè!',
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Update professional profile error:', error);
    return res.status(500).json({ error: 'Erè pandan mete ajou pwofil la.' });
  }
};

const getAllServices = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;
    const category = req.query.category || null;

    let query = `
      SELECT p.id, p.title, p.bio, p.category_slug, p.starting_price, p.rating, p.verification_status, u.full_name
      FROM professional_profiles p
      JOIN users u ON p.user_id = u.id
      WHERE u.account_status = 'ACTIVE' AND p.is_available = true
    `;
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND p.category_slug = $${params.length}`;
    }

    query += ` ORDER BY p.rating DESC, p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM professional_profiles p JOIN users u ON p.user_id = u.id WHERE u.account_status = $1 AND p.is_available = true',
      ['ACTIVE']
    );

    return res.json({
      services: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
      }
    });
  } catch (error) {
    console.error('Get all services error:', error);
    return res.status(500).json({ error: 'Erè pandan chajman sèvis yo.' });
  }
};

const createServiceRequest = async (req, res) => {
  const { professionalId, description, price } = req.body;
  const customerId = req.user.id;

  try {
    const professional = await pool.query(
      `SELECT p.id, u.id as user_id FROM professional_profiles p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1 AND u.account_status = 'ACTIVE'`,
      [professionalId]
    );

    if (professional.rows.length === 0) {
      return res.status(404).json({ error: 'Pwofesyonèl sa a pa egziste oswa pa aktif.' });
    }

    const finalPrice = price || 0;

    const result = await pool.query(
      `INSERT INTO service_requests (customer_id, professional_id, description, price, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, customer_id, professional_id, description, price, status, created_at`,
      [customerId, professionalId, description, finalPrice, SERVICE_STATUS.PENDING]
    );

    return res.status(201).json({
      message: 'Demann sèvis voye ak siksè!',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Create service request error:', error);
    return res.status(500).json({ error: 'Erè pandan kreyasyon demann sèvis la.' });
  }
};

const getUserRequests = async (req, res) => {
  const targetUserId = req.params.userId;

  try {
    const result = await pool.query(
      `SELECT r.id, r.description, r.status, r.price, r.payment_status, r.created_at, p.title AS service_title, u.full_name
       FROM service_requests r
       JOIN professional_profiles p ON r.professional_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE r.customer_id = $1
       ORDER BY r.created_at DESC`,
      [targetUserId]
    );

    return res.json({ requests: result.rows });
  } catch (error) {
    console.error('Get user requests error:', error);
    return res.status(500).json({ error: 'Erè pandan chajman kòmand yo.' });
  }
};

const getServiceRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT r.id, r.customer_id, r.professional_id, r.description, r.status, r.price, r.payment_status, r.created_at,
              p.title AS service_title, u1.full_name as customer_name, u2.full_name as professional_name
       FROM service_requests r
       JOIN professional_profiles p ON r.professional_id = p.id
       JOIN users u1 ON r.customer_id = u1.id
       JOIN users u2 ON p.user_id = u2.id
       WHERE r.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Demann sèvis pa jwenn.' });
    }

    return res.json({ request: result.rows[0] });
  } catch (error) {
    console.error('Get service request error:', error);
    return res.status(500).json({ error: 'Erè pandan chajman demann sèvis la.' });
  }
};

const updateServiceRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const validStatuses = Object.values(SERVICE_STATUS);
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estati a pa valid.' });
    }

    const result = await pool.query(
      `UPDATE service_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Demann sèvis pa jwenn.' });
    }

    return res.json({
      message: 'Demann mete ajou ak siksè!',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Update service request error:', error);
    return res.status(500).json({ error: 'Erè pandan mete ajou demann sèvis la.' });
  }
};

const cancelServiceRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await pool.query(
      'SELECT status FROM service_requests WHERE id = $1',
      [id]
    );

    if (request.rows.length === 0) {
      return res.status(404).json({ error: 'Demann sèvis pa jwenn.' });
    }

    if (request.rows[0].status === SERVICE_STATUS.COMPLETED) {
      return res.status(400).json({ error: 'Ou pa ka anile yon demann ki konplete.' });
    }

    const result = await pool.query(
      `UPDATE service_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [SERVICE_STATUS.CANCELLED, id]
    );

    return res.json({
      message: 'Demann anile ak siksè!',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Cancel service request error:', error);
    return res.status(500).json({ error: 'Erè pandan anilasyon demann sèvis la.' });
  }
};

const uploadServiceImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Enpòtan fichiye.' });
    }

    const { entityType, entityId } = req.body;

    const result = await pool.query(
      `INSERT INTO file_uploads (user_id, filename, stored_filename, file_size, mime_type, file_path, entity_type, entity_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, stored_filename, file_path`,
      [
        req.user.id,
        req.file.originalname,
        req.file.filename,
        req.file.size,
        req.file.mimetype,
        `/uploads/${req.file.filename}`,
        entityType || null,
        entityId || null
      ]
    );

    return res.status(201).json({
      message: 'Imaj evaliye ak siksè!',
      file: result.rows[0]
    });
  } catch (error) {
    console.error('Upload service image error:', error);
    return res.status(500).json({ error: 'Erè pandan evaliye imaj la.' });
  }
};

module.exports = {
  createProfessionalProfile,
  getProfessionalProfile,
  updateProfessionalProfile,
  getAllServices,
  createServiceRequest,
  getUserRequests,
  getServiceRequest,
  updateServiceRequestStatus,
  cancelServiceRequest,
  uploadServiceImage
};
