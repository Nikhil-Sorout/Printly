import express from 'express';
import { query, queryWithSchema } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { itemSchema } from '../validators/schemas.js';

const router = express.Router();

// Get all items with pagination
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    console.log(req.query)
    const shopId = req.query.shopId;
    console.log('shopId: ', shopId)
    const result = await queryWithSchema(shopId,
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
    console.log(req.query)
    const shopId = req.query.shopId;
    const item = await itemSchema.validateAsync(req.body);
    
    const result = await queryWithSchema(shopId,
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
router.put('/:name/:category', authenticateToken, async (req, res, next) => {
  try {
    const { name, category} = req.params;
    const shopId = req.query.shopId;
    console.log(shopId)
    const item = await itemSchema.validateAsync(req.body);
    console.log(item)
    const result = await queryWithSchema(shopId,
      'UPDATE items SET name = $1, price = $2, category = $3, updated_at = CURRENT_TIMESTAMP WHERE name = $4 AND category  = $5 RETURNING *',
      [item.name, item.price, item.category, name, category]
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
router.delete('/delete/:name/:price', authenticateToken, async (req, res, next) => {
  try {
    const { name, price } = req.params;
    const shopId = req.query.shopId;
    console.log(name, price, shopId)
    // Fetch the item ID using name and price
    const findItem = await queryWithSchema(shopId,
      'SELECT id FROM items WHERE name = $1 AND price = $2',
      [name, price]
    );
    console.log(findItem)
    if (findItem.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found'
      });
    }

    const itemId = findItem.rows[0].id;
    console.log(itemId)
    // Proceed with deletion
    const result = await queryWithSchema(shopId,
      'DELETE FROM items WHERE id = $1 RETURNING *',
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 