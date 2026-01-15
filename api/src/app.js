import express from 'express';
import expressWs from 'express-ws';
import passport from 'passport';

import authRoutes from './routes/auth.js';
import threadRoutes from './routes/threads.js';
import wsRoutes from './routes/ws.js';
import devRoutes from './routes/dev.js';

import './config/passport.js';
import './db/index.js';

const app = express();
expressWs(app);

app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/threads', threadRoutes);
app.use('/ws', wsRoutes);
app.use('/dev', devRoutes);

export default app;