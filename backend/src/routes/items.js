import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { itemSchema } from '../validators/schemas.js';

const router = express.Router();

// Get all items with pagination
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM items ORDER BY category'
    );

    res.json({
      status: 'success',
      data: {
        items: result.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create new item
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const item = await itemSchema.validateAsync(req.body);
    
    const result = await query(
      'INSERT INTO items (name, price, category) VALUES ($1, $2, $3) RETURNING *',
      [item.name, item.price, item.category]
    );

    res.status(201).json({
      status: 'success',
      data: {
        item: result.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update item
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await itemSchema.validateAsync(req.body);
    
    const result = await query(
      'UPDATE items SET name = $1, price = $2, category = $3, stock = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [item.name, item.price, item.category, item.stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        item: result.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete item
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'DELETE FROM items WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 