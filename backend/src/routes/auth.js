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
    
    const result = await query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username',
      [username, email, hashedPassword]
    );

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
      'SELECT * FROM users WHERE email = $1',
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
          username: user.username
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 