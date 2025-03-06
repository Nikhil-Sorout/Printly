import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { customerSchema } from '../validators/schemas.js';

const router = express.Router();

// Create new customer
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const customer = await customerSchema.validateAsync(req.body);
    
    const result = await query(
      'INSERT INTO customers (name, phone, email) VALUES ($1, $2, $3) RETURNING *',
      [customer.name, customer.phone, customer.email]
    );

    res.status(201).json({
      status: 'success',
      data: {
        customer: result.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get customer details with purchase history
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const customerResult = await query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found'
      });
    }

    const transactionsResult = await query(
      `SELECT t.*, 
        json_agg(json_build_object(
          'item_name', i.name,
          'quantity', ti.quantity,
          'price', ti.price_at_time
        )) as items
       FROM transactions t
       JOIN transaction_items ti ON t.id = ti.transaction_id
       JOIN items i ON ti.item_id = i.id
       WHERE t.customer_id = $1
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
      [id]
    );

    res.json({
      status: 'success',
      data: {
        customer: customerResult.rows[0],
        transactions: transactionsResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// Search customers
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM customers';
    const queryParams = [];
    
    if (search) {
      queryText += ' WHERE name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1';
      queryParams.push(`%${search}%`);
    }

    queryText += ' ORDER BY name LIMIT $' + (queryParams.length + 1) + 
                ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(limit, offset);

    const result = await query(queryText, queryParams);
    
    const countResult = await query(
      'SELECT COUNT(*) FROM customers' + 
      (search ? ' WHERE name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1' : ''),
      search ? [`%${search}%`] : []
    );

    res.json({
      status: 'success',
      data: {
        customers: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].count),
          pages: Math.ceil(countResult.rows[0].count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 