import { Pool } from 'pg';
import 'dotenv/config.js';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

async function connectWithRetry(retries = 5) {
    try {
        await pool.connect();
        console.log('Connected to the database successfully.');
    } catch (err) {
        console.error('DB connection failed, retrying...', err.code);
        if (retries > 0) {
            await new Promise(r => setTimeout(r, 3000));
            return connectWithRetry(retries - 1);
        }
        throw err;
    }
}

connectWithRetry();

export default pool;