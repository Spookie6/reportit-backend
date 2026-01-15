import express from 'express';
const router = express.Router();
import passport from 'passport';
import { register, login, verify } from '../controllers/auth.controllers.js';

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verify);

router.get(
    '/me',
    passport.authenticate('jwt', { session: false }),
    (req, res) => res.json({ user: req.user })
);

export default router;