import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/index.js';
import { loginSchema, signUpSchema } from '../validators/schemas.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = await signUpSchema.validateAsync(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await query(
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`,
      [username, email, hashedPassword]
    );
    const shop_id = userResult.rows[0].id;

    // Step 2: Create the schema for the shop
    await query(`CREATE SCHEMA shop_${shop_id}`);

    // Step 3: Create tables inside the schema
    await query(`
      CREATE TABLE shop_${shop_id}.items (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          category VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE shop_${shop_id}.transactions (
          id SERIAL PRIMARY KEY,
          total_amount DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE shop_${shop_id}.transaction_items (
          id SERIAL PRIMARY KEY,
          transaction_id INTEGER REFERENCES shop_${shop_id}.transactions(id),
          item_id INTEGER REFERENCES shop_${shop_id}.items(id),
          quantity INTEGER NOT NULL,
          price_at_time DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `);


    res.status(201).json({
      status: 'success',
      data: {
        user: result.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = await loginSchema.validateAsync(req.body);

    const result = await query(
      'SELECT * FROM Users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log(token);
    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          shop_id: user.shop_id
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 