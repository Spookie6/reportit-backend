import pool from '../index.js';

export async function getUserById(id) {
    const res = await pool.query('SELECT * FROM gebruiker WHERE gebruiker_id = $1', [id]);
    return res.rows.length ? res.rows[0] : null;
}

export async function getUserByEmail(email) {
    const res = await pool.query('SELECT * FROM gebruiker WHERE email = $1', [email]);
    return res.rows.length ? res.rows[0] : null;
}

export async function getUserByUsername(username) {
    const res = await pool.query('SELECT * FROM gebruiker WHERE gebruikersnaam = $1', [username]);
    return res.rows.length ? res.rows[0] : null;
}

export async function verifyUser(id) {
    return pool.query('UPDATE gebruiker SET verified = TRUE WHERE gebruiker_id = $1', [id]);
}

export async function createUser(name, email, password) {
    const res = await pool.query(
        'INSERT INTO gebruiker (gebruikersnaam, email, wachtwoord) VALUES ($1, $2, $3) RETURNING *',
        [name, email, password]
    );
    return res.rows.length ? res.rows[0] : null;
}