import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './routes/items.js';
import transactionRoutes from './routes/transactions.js';
import customerRoutes from './routes/customers.js';
import authRoutes from './routes/auth.js';
import analyticsRoutes from './routes/analytics.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling
app.use(errorHandler);

async function checkDatabaseReady() {
  let retries = 5;
  while (retries) {
    try {
      await pool.query("SELECT 1"); // Test if the database is accessible
      console.log("Database is ready!");
      break;
    } catch (err) {
      console.error(" Database not ready, retrying in 2 seconds...");
      retries--;
      await new Promise(res => setTimeout(res, 2000)); // Wait before retrying
    }
  }
}

checkDatabaseReady().then(() => {

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})