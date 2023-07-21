import pgs from 'pg';
import dotenv from 'dotenv'

const { Pool } = pgs;
dotenv.config()

// PostgreSQL Connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

pool.connect((err, client, release) => {
  if (err) {
      console.error('Error acquiring client', err.stack)
  } else {
      console.log('Connection established');
  }
  release();
});

export default pool;
