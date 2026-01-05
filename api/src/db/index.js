import { Pool } from 'pg';
import 'dotenv/config.js';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

(async () => {
    try {
        await pool.connect();
        console.log('Connected to the database successfully.');
    } catch (error) {
        console.error('Database connection error:', error);
    }
})();

export default pool;