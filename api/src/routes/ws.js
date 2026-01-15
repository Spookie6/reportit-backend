import express from 'express';
import expressWs from 'express-ws';
const router = express.Router();
import passport from 'passport';
import { handleConnection } from "../controllers/ws.controllers.js";

expressWs(router);

router.ws(
    '/',
    passport.authenticate('jwt', { session: false }),
    handleConnection
);

export default router;