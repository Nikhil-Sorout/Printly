import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// ✅ Create a connection pool for efficient resource management
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Max connections in the pool
  idleTimeoutMillis: 30000, // Auto close idle connections
});

// ✅ Get a database client for a specific shop
export const getClientForShop = async (shopId) => {
  const client = await pool.connect(); // Get a connection from the pool
  await client.query(`SET search_path TO shop_${shopId}`); // Set schema dynamically
  return client;
};

// ✅ Query function for general (non-shop) queries (e.g., authentication)
export const query = async (text, params = []) => {
  const client = await pool.connect(); // Get a connection
  try {
    const res = await client.query(text, params);
    console.log("Executed query:", { text, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Error executing query:", { text, error });
    throw error;
  } finally {
    client.release(); // Release connection back to the pool
  }
};

// ✅ Query function for shop-specific queries
export const queryWithSchema = async (shopId, text, params = []) => {
  const client = await getClientForShop(shopId); // Get shop-specific client
  try {
    const res = await client.query(text, params);
    console.log("Executed shop query:", { shopId, text, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Error executing shop query:", { shopId, text, error });
    throw error;
  } finally {
    client.release(); // Release connection back to the pool
  }
};

export default pool; 