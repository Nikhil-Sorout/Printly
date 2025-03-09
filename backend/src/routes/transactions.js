import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { transactionSchema } from '../validators/schemas.js';

const router = express.Router();

// Create new transaction
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { items } = await transactionSchema.validateAsync(req.body);

    // Start transaction
    await query('BEGIN');

    let total_amount = 0;
    const itemDetails = [];

    // Fetch all items and calculate total
    for (const item of items) {
      const itemResult = await query(
        'SELECT * FROM items WHERE id = $1 FOR UPDATE',
        [item.item_id]
      );

      if (itemResult.rows.length === 0) {
        await query('ROLLBACK');
        return res.status(404).json({
          status: 'error',
          message: `Item with id ${item.item_id} not found`
        });
      }

      const dbItem = itemResult.rows[0];

      // Check stock
      // if (dbItem.stock < item.quantity) {
      //   await query('ROLLBACK');
      //   return res.status(400).json({
      //     status: 'error',
      //     message: `Insufficient stock for item ${dbItem.name}`
      //   });
      // }

      // Update stock
      // await query(
      //   'UPDATE items SET stock = stock - $1 WHERE id = $2',
      //   [item.quantity, item.item_id]
      // );

      total_amount += dbItem.price * item.quantity;
      itemDetails.push({
        ...dbItem,
        quantity: item.quantity,
        subtotal: dbItem.price * item.quantity
      });
    }

    // Create transaction
    const transactionResult = await query(
      'INSERT INTO transactions (total_amount) VALUES ($1) RETURNING *',
      [total_amount]
    );

    // Create transaction items
    for (const item of items) {
      await query(
        'INSERT INTO transaction_items (transaction_id, item_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
        [transactionResult.rows[0].id, item.item_id, item.quantity,
        itemDetails.find(i => i.id === item.item_id).price]
      );
    }

    await query('COMMIT');

    res.status(201).json({
      status: 'success',
      data: {
        transaction: {
          ...transactionResult.rows[0],
          items: itemDetails
        }
      }
    });
  } catch (error) {
    await query('ROLLBACK');
    next(error);
  }
});

// Get receipt
router.get('/:id/receipt', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const transactionResult = await query(
      `SELECT t.*
       FROM transactions t
       WHERE t.id = $1`,
      [id]
    );

    if (transactionResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }

    const itemsResult = await query(
      `SELECT ti.*, i.name, i.category
       FROM transaction_items ti
       JOIN items i ON ti.item_id = i.id
       WHERE ti.transaction_id = $1`,
      [id]
    );

    const receipt = {
      ...transactionResult.rows[0],
      items: itemsResult.rows.map(item => ({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price_at_time,
        subtotal: item.price_at_time * item.quantity
      }))
    };

    res.json({
      status: 'success',
      data: { receipt }
    });
  } catch (error) {
    next(error);
  }
});

// Get transactions with pagination and filters
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const {
      start_date,
      end_date,
    } = req.query;

    let whereClause = '';
    const params = [];
    let paramCount = 1;

    if (start_date) {
      whereClause += `${whereClause ? ' AND ' : 'WHERE '} created_at >= $${paramCount++}`;
      params.push(new Date(start_date));
    }

    if (end_date) {
      whereClause += `${whereClause ? ' AND ' : 'WHERE '} created_at <= $${paramCount++}`;
      params.push(new Date(end_date));
    }

    // if (customer_id) {
    //   whereClause += `${whereClause ? ' AND ' : 'WHERE '} customer_id = $${paramCount++}`;
    //   params.push(customer_id);
    // }

    const result = await query(
      `SELECT t.*
       FROM transactions t
       ${whereClause}
       ORDER BY t.created_at DESC`,
      [...params]
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM transactions ${whereClause}`,
      params
    );

    res.status(200).json({
      status: 'success',
      data: {
        transactions: result.rows,
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 