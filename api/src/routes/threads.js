import express from 'express';
const router = express.Router();
import passport from 'passport';
import * as Thread from '../db/querries/threads.js';

router.get(
    '/list',
    passport.authenticate('jwt', { session: false }),
    (req, res) => res.json({ threads: Thread.getAll() })
);

router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const { title, content } = req.body;
            const userId = req.user.id;
            const newThread = await Thread.createThread(userId, title, content);

            res.status(201).json({ thread: newThread });
        } catch (error) {
            console.error('Error creating thread:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
)

export default router;