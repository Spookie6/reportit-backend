import express from 'express';
import { clearUsers } from '../db/querries/user.js';

const router = express.Router();

router.post('/clear', async (req, res) => {
    try {
        await clearUsers()
        res.status(200).json({ message: 'All users cleared' })
    } catch (error) {
        console.error('Error clearing users:', error)
        res.status(500).json({ error: 'Server error' })
    }
});

export default router;