import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

const ITEM_SELECT = `
  SELECT i.*, s.name as supplier_name, s.phone as supplier_phone, s.email as supplier_email
  FROM inventory_items i
  LEFT JOIN suppliers s ON i.supplier_id = s.id
`;

// List all items
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let sql = ITEM_SELECT;
    const params = [];
    if (category) {
      params.push(category);
      sql += ` WHERE i.category = $${params.length}`;
    }
    sql += ' ORDER BY i.name ASC';
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Low-stock items (below par level)
router.get('/low-stock', async (req, res) => {
  try {
    const result = await pool.query(
      ITEM_SELECT + ' WHERE i.current_quantity < i.par_level ORDER BY (i.current_quantity / NULLIF(i.par_level, 0)) ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders list
router.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(ITEM_SELECT + ' WHERE i.id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create item
router.post('/', async (req, res) => {
  try {
    const { name, category, current_quantity, par_level, unit, supplier_id, cost_per_unit, location, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO inventory_items (name, category, current_quantity, par_level, unit, supplier_id, cost_per_unit, location, notes, last_updated)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *`,
      [name, category, current_quantity || 0, par_level || 0, unit || 'unité', supplier_id || null, cost_per_unit || null, location || null, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const { name, category, current_quantity, par_level, unit, supplier_id, cost_per_unit, location, notes } = req.body;
    const result = await pool.query(
      `UPDATE inventory_items SET
         name = COALESCE($1, name),
         category = COALESCE($2, category),
         current_quantity = COALESCE($3, current_quantity),
         par_level = COALESCE($4, par_level),
         unit = COALESCE($5, unit),
         supplier_id = $6,
         cost_per_unit = COALESCE($7, cost_per_unit),
         location = COALESCE($8, location),
         notes = COALESCE($9, notes),
         last_updated = NOW(),
         updated_at = NOW()
       WHERE id = $10 RETURNING *`,
      [name, category, current_quantity, par_level, unit, supplier_id || null, cost_per_unit, location, notes, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM inventory_items WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Place an order for an item
router.post('/:id/order', async (req, res) => {
  try {
    const itemRes = await pool.query(
      'SELECT i.*, s.name as supplier_name FROM inventory_items i LEFT JOIN suppliers s ON i.supplier_id = s.id WHERE i.id = $1',
      [req.params.id]
    );
    if (!itemRes.rows.length) return res.status(404).json({ error: 'Item not found' });
    const item = itemRes.rows[0];

    const { quantity_ordered, notes } = req.body;
    const qty = quantity_ordered || (item.par_level - item.current_quantity);

    const orderRes = await pool.query(
      `INSERT INTO orders (item_id, supplier_id, item_name, supplier_name, quantity_ordered, unit, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7) RETURNING *`,
      [item.id, item.supplier_id, item.name, item.supplier_name, qty, item.unit, notes || null]
    );
    res.status(201).json(orderRes.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
