import pg from 'pg';
const { Pool } = pg;

console.log('🔌 Initializing database connection...');
console.log('📍 DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✓' : 'NOT SET ✗');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('💥 Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = (text, params) => {
  console.log('🗄️  Executing query:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
  return pool.query(text, params);
};

export default pool;
