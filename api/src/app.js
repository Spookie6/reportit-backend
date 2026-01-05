import express from 'express';
import passport from 'passport';

import authRoutes from './routes/auth.js';
import threadRoutes from './routes/threads.js';

import './config/passport.js';
import './db/index.js';

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/threads', threadRoutes);

export default app;