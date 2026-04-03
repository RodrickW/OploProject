import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

const DEFAULT_USER = {
  email: 'user@oplo.ai',
  full_name: 'Utilisateur Oplo',
  role: 'admin',
};

router.get('/me', async (req, res) => {
  try {
    let result = await pool.query('SELECT * FROM app_users WHERE email = $1', [DEFAULT_USER.email]);
    if (result.rows.length === 0) {
      result = await pool.query(
        'INSERT INTO app_users (email, full_name, role) VALUES ($1, $2, $3) RETURNING *',
        [DEFAULT_USER.email, DEFAULT_USER.full_name, DEFAULT_USER.role]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /auth/me error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/me', async (req, res) => {
  try {
    const { full_name, role } = req.body;
    const result = await pool.query(
      `UPDATE app_users SET full_name = COALESCE($1, full_name), role = COALESCE($2, role)
       WHERE email = $3 RETURNING *`,
      [full_name, role, DEFAULT_USER.email]
    );
    if (result.rows.length === 0) {
      const insert = await pool.query(
        'INSERT INTO app_users (email, full_name, role) VALUES ($1, $2, $3) RETURNING *',
        [DEFAULT_USER.email, full_name || DEFAULT_USER.full_name, role || DEFAULT_USER.role]
      );
      return res.json(insert.rows[0]);
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /auth/me error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/is-authenticated', (req, res) => {
  res.json({ authenticated: true });
});

export default router;
