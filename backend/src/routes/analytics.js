import express from 'express';
import { query, queryWithSchema } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { exportToCSV } from '../utils/csvExporter.js';

const router = express.Router();


// Get best-selling items
router.get('/best-sellers', authenticateToken, async (req, res, next) => {
  try {
    const { limit = 4, year, month, shopId } = req.query;
    console.log(shopId) 

    const result = await queryWithSchema(shopId,
      `SELECT 
        i.id,
        i.name,
        i.category,
        SUM(ti.quantity) as total_quantity,
        SUM(ti.quantity * ti.price_at_time) as total_revenue
       FROM transaction_items ti
       JOIN items i ON ti.item_id = i.id
       JOIN transactions t ON ti.transaction_id = t.id
       WHERE EXTRACT(YEAR FROM t.created_at) = $2 AND EXTRACT(MONTH FROM t.created_at) = $3
       GROUP BY i.id, i.name, i.category
       ORDER BY total_quantity DESC
       LIMIT $1`,
      [limit, year, month]
    );

    res.status(200).json({
      status: 'success',
      data: { best_sellers: result.rows }
    });
  } catch (error) {
    next(error);
  }
});

// Get category-wise sales breakdown
router.get('/category-sales', authenticateToken, async (req, res, next) => {
  try {
    const { month, year, shopId } = req.query;
    console.log(shopId)
    const params = [];
    let dateFilter = '';

    if (month && year) {
      dateFilter = 'WHERE EXTRACT(MONTH FROM t.created_at) = $1 AND EXTRACT(YEAR FROM t.created_at) = $2';
      params.push(month, year);
    }

    const result = await queryWithSchema(shopId,
      `SELECT 
        i.category,
        COUNT(DISTINCT t.id) as total_transactions,
        SUM(ti.quantity) as total_items_sold,
        SUM(ti.quantity * ti.price_at_time) as total_revenue,
        ROUND(AVG(ti.price_at_time), 2) as average_item_price
       FROM transaction_items ti
       JOIN items i ON ti.item_id = i.id
       JOIN transactions t ON ti.transaction_id = t.id
       ${dateFilter}
       GROUP BY i.category
       ORDER BY total_revenue DESC`,
      params
    );

    res.status(200).json({
      status: 'success',
      data: { category_sales: result.rows }
    });
  } catch (error) {
    next(error);
  }
});

// Get revenue trends (weekly/monthly)
router.get('/revenue-trends', authenticateToken, async (req, res, next) => {
  try {
    const { period = 'weekly' } = req.query;
    const {shopId} = req.params;
    console.log(shopId)
    const timeFormat = period === 'weekly' 
      ? `DATE_TRUNC('week', created_at)` 
      : `DATE_TRUNC('month', created_at)`;

    const result = await queryWithSchema(shopId,
      `SELECT 
        ${timeFormat} as period,
        COUNT(*) as transaction_count,
        SUM(total_amount) as total_revenue,
        ROUND(AVG(total_amount), 2) as average_transaction
       FROM transactions
       WHERE created_at >= NOW() - INTERVAL '12 months'
       GROUP BY period
       ORDER BY period DESC`
    );

    res.json({
      status: 'success',
      data: { revenue_trends: result.rows }
    });
  } catch (error) {
    next(error);
  }
});




// // Export inventory status
// router.get('/export/inventory', authenticateToken, async (req, res, next) => {
//   try {
//     const result = await query(
//       `SELECT 
//         id,
//         name,
//         category,
//         price,
//         stock,
//         created_at,
//         updated_at
//        FROM items
//        ORDER BY category, name`
//     );

//     const filename = `inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
//     exportToCSV(res, result.rows, filename);
//   } catch (error) {
//     next(error);
//   }
// });

// Get monthly sales summary for a selected year
router.get('/monthly', authenticateToken, async (req, res, next) => {
  try {  
    const { year, shopId } = req.query;
    console.log(shopId)
    const params = [];
    let dateFilter = '';

    if (year) {
      dateFilter = 'WHERE EXTRACT(YEAR FROM created_at) = $1';
      params.push(year);
    }

    const result = await queryWithSchema(shopId,
      `SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(total_amount) as total_sales
       FROM transactions
       ${dateFilter}
       GROUP BY month
       ORDER BY month ASC`,
      params
    );

    res.json({
      status: 'success',
      data: { monthly_sales: result.rows }
    });
  } catch (error) {
    next(error);
  }
});

export default router;