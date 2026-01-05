import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import * as User from '../db/querries/user.js';

function createToken(user) {
    return jwt.sign({ id: user.gebruiker_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function createEmailVerificationToken(user) {
    return jwt.sign({ id: user.gebruiker_id, email: user.email }, process.env.EMAIL_VERIFICATION_SECRET, { expiresIn: '15m' });
}

const transporter = nodemailer.createTransport({
    host: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export async function testTransporter() {
    try {
        await transporter.verify();
        console.log('Email transporter is ready');
    } catch (error) {
        console.error('Error with email transporter:', error);
    }
}

async function sendVerificationEmail(user, token) {
    const verificationLink = `http://localhost:8080/auth/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verify your email',
        text: `Click the following link to verify your email: ${verificationLink}`,
    };
    await transporter.sendMail(mailOptions);
}

export async function register(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing parameters' });
    }
    if (username.length < 3 || password.length < 6) {
        return res.status(400).json({ message: 'Username or password too short' });
    }

    try {
        const existingEmail = await User.getUserByEmail(email);
        if (existingEmail) {
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

        res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function verify(req, res) {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Verification token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
        const user = await User.getUserById(decoded.id);

        await User.verifyUser(user.gebruiker_id);

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
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

