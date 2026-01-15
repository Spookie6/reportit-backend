import passport from 'passport';
import { Strategy, ExtractJwt } from "passport-jwt";
import * as User from '../db/querries/user.js';

passport.use(
    new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    }, async (payload, done) => {
        try {
            const user = await User.getUserById(payload.id);
            if (!user) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);