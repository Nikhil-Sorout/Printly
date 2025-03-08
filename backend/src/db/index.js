import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
.then(()=>console.log("Connected to the database", client.connectionParameters.database, client.connectionParameters.host, client.connectionParameters.port))
.catch((err)=>console.error("Error connecting to the database", err))


export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
};

export default client; 