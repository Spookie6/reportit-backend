import express from 'express';
const router = express.Router();
import passport from 'passport';
import * as Thread from '../db/querries/threads.js';
import { createThread } from '../controllers/threads.controllers.js';

router.get(
    '/list',
    passport.authenticate('jwt', { session: false }),
    (req, res) => res.json({ threads: Thread.getAll() })
);

router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    createThread
)

router.post(
    '/:threadId/messages',
    passport.authenticate('jwt', { session: false }),

);

export default router;