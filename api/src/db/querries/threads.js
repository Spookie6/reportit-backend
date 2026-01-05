import pool from '../index.js';

export async function createThread({ title, content, userId }) {
    const result = await pool.query(
        'INSERT INTO threads (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
        [title, content, userId]
    );
    return result.rows[0];
}

export async function getAll() {
    const result = await pool.query('SELECT * FROM threads');
    return result.rows;
}