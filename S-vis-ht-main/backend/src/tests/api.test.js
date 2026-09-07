const request = require('supertest');
const app = require('../server');
const db = require('../config/db');

describe('SÈVIS-HT API Integration Tests', () => {
  afterAll(async () => {
    await db.pool.end();
  });

  describe('GET /health', () => {
    it('dwe retounen status UP', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'UP');
    });
  });

  describe('Security & Validation Headers', () => {
    it('dwe gen antèt sekirite Helmet yo', async () => {
      const res = await request(app).get('/health');
      expect(res.headers).toHaveProperty('x-dns-prefetch-control');
    });
  });
});
