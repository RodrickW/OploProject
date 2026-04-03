import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

const ALLOWED_ENTITIES = [
  'Restaurant', 'Customer', 'TeamMember', 'Problem', 'SOP',
  'KPIMetric', 'Competitor', 'OnboardingProfile', 'OperationalRitual',
  'Insight', 'Feedback', 'Goal', 'User',
];

function isAllowed(name) {
  return ALLOWED_ENTITIES.includes(name);
}

// List all / filter
router.get('/:entityName', async (req, res) => {
  const { entityName } = req.params;
  if (!isAllowed(entityName)) return res.status(400).json({ error: 'Unknown entity' });

  try {
    const { sort = '-created_at', limit } = req.query;

    // Build filter conditions from query params prefixed with filter_
    const filters = {};
    for (const [key, value] of Object.entries(req.query)) {
      if (key.startsWith('filter_')) {
        filters[key.replace('filter_', '')] = value;
      }
    }

    let sql = 'SELECT id, data, created_by, created_at, updated_at FROM entities WHERE entity_type = $1';
    const params = [entityName];

    // Apply JSONB filters
    for (const [field, value] of Object.entries(filters)) {
      params.push(value);
      sql += ` AND data->>'${field}' = $${params.length}`;
    }

    // Sorting
    const descSort = sort.startsWith('-');
    const sortField = descSort ? sort.slice(1) : sort;
    if (sortField === 'created_at' || sortField === 'updated_at') {
      sql += ` ORDER BY ${sortField} ${descSort ? 'DESC' : 'ASC'}`;
    } else {
      sql += ` ORDER BY data->>'${sortField}' ${descSort ? 'DESC' : 'ASC'} NULLS LAST`;
    }

    if (limit) {
      params.push(parseInt(limit));
      sql += ` LIMIT $${params.length}`;
    }

    const result = await pool.query(sql, params);
    const rows = result.rows.map(row => ({
      id: row.id,
      ...row.data,
      created_by: row.created_by,
      created_date: row.created_at,
      updated_at: row.updated_at,
    }));
    res.json(rows);
  } catch (err) {
    console.error(`GET /entities/${entityName} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Get one by ID
router.get('/:entityName/:id', async (req, res) => {
  const { entityName, id } = req.params;
  if (!isAllowed(entityName)) return res.status(400).json({ error: 'Unknown entity' });

  try {
    const result = await pool.query(
      'SELECT id, data, created_by, created_at, updated_at FROM entities WHERE entity_type = $1 AND id = $2',
      [entityName, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const row = result.rows[0];
    res.json({ id: row.id, ...row.data, created_by: row.created_by, created_date: row.created_at, updated_at: row.updated_at });
  } catch (err) {
    console.error(`GET /entities/${entityName}/${id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Create
router.post('/:entityName', async (req, res) => {
  const { entityName } = req.params;
  if (!isAllowed(entityName)) return res.status(400).json({ error: 'Unknown entity' });

  try {
    const { created_by, ...data } = req.body;
    const result = await pool.query(
      'INSERT INTO entities (entity_type, data, created_by) VALUES ($1, $2, $3) RETURNING id, data, created_by, created_at, updated_at',
      [entityName, JSON.stringify(data), created_by || null]
    );
    const row = result.rows[0];
    res.status(201).json({ id: row.id, ...row.data, created_by: row.created_by, created_date: row.created_at });
  } catch (err) {
    console.error(`POST /entities/${entityName} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:entityName/:id', async (req, res) => {
  const { entityName, id } = req.params;
  if (!isAllowed(entityName)) return res.status(400).json({ error: 'Unknown entity' });

  try {
    const { created_by, created_date, id: _id, ...data } = req.body;
    const result = await pool.query(
      `UPDATE entities
       SET data = data || $1::jsonb, updated_at = NOW()
       WHERE entity_type = $2 AND id = $3
       RETURNING id, data, created_by, created_at, updated_at`,
      [JSON.stringify(data), entityName, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const row = result.rows[0];
    res.json({ id: row.id, ...row.data, created_by: row.created_by, created_date: row.created_at });
  } catch (err) {
    console.error(`PUT /entities/${entityName}/${id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete('/:entityName/:id', async (req, res) => {
  const { entityName, id } = req.params;
  if (!isAllowed(entityName)) return res.status(400).json({ error: 'Unknown entity' });

  try {
    await pool.query('DELETE FROM entities WHERE entity_type = $1 AND id = $2', [entityName, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(`DELETE /entities/${entityName}/${id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
