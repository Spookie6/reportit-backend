import passport from 'passport';
import { Strategy, ExtractJwt } from "passport-jwt";
import * as User from '../db/querries/user.js';

passport.use(
    new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    }, (payload, done) => {
        try {
            const user = User.getUserById(payload.id);
            if (!user) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);