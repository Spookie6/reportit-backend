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

app.use(express.json({ strict: false }));
app.use(passport.initialize());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/auth', authRoutes);
app.use('/threads', threadRoutes);
app.use('/ws', wsRoutes);
app.use('/dev', devRoutes);

export default app;