import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as User from '../db/querries/user.js';
import { sendVerificationEmail } from '../util/mailersend.js';
import path from 'path';

function createToken(user) {
    return jwt.sign({ id: user.gebruiker_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function createEmailVerificationToken(user) {
    return jwt.sign({ id: user.gebruiker_id, email: user.email }, process.env.EMAIL_VERIFICATION_SECRET, { expiresIn: '15m' });
}

export async function register(req, res) {
    const { email, username, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    if (username.length < 3 || password.length < 6) {
        return res.status(400).json({ message: 'Username or password too short' });
    }

    try {
        const existingEmail = await User.getUserByEmail(email);

        if (existingEmail) {
            if (!existingEmail.verified) {
                const token = createEmailVerificationToken(existingEmail);
                await sendVerificationEmail(existingEmail, token);

                return res.status(200).json({
                    message: 'Account exists but is not verified. Verification email resent.',
                });
            }

            return res.status(400).json({ message: 'User already exists' });
        }

        const existingUsername = await User.getUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.createUser(username, email, hashedPassword);

        const token = createEmailVerificationToken(newUser);
        await sendVerificationEmail(newUser, token);

        return res.status(201).json({
            message: 'User registered successfully. Please verify your email.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export async function verify(req, res) {
    const { token } = req.query;

    if (!token) {
        return res.sendFile(path.join(process.cwd(), 'src', 'pages', 'missingToken.html'));
    }

    try {
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
        const user = await User.getUserById(decoded.id);

        await User.verifyUser(user.gebruiker_id);

        return res.sendFile(path.join(process.cwd(), 'src', 'pages', 'verified.html'));
    } catch (error) {
        return res.sendFile(path.join(process.cwd(), 'src', 'pages', 'missingToken.html'));
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.wachtwoord);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.verified) {
            return res.status(403).json({ message: 'Please verify your email first' });
        }

        const token = createToken(user);
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

