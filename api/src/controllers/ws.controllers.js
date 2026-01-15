import jwt from 'jsonwebtoken';
import * as User from '../db/querries/user.js';

export async function verifyWebSocketConnection(ws, req) {
    const urlParams = new URLSearchParams(req.url.replace('/?', ''));
    const token = urlParams.get('token');

    if (!token) {
        ws.close(1008, 'Authentication token missing');
        console.log('WebSocket connection rejected: No token provided');
        return false;
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.getUserById(payload.id);
        ws.user = user;
        return true;
    } catch (err) {
        ws.close(1008, 'Invalid token');
        return false;
    }
}

export async function handleConnection(ws, req) {
    ws.room = null;

    const isAuthenticated = await verifyWebSocketConnection(ws, req);
    if (!isAuthenticated) {
        return;
    }

    console.log(`User ${ws.user.gebruikersnaam} connected via WebSocket`);

    ws.on('connection', () => {
        console.log(`User ${ws.user.gebruikersnaam} connected via WebSocket`);
    });

    ws.on('message', (msg) => {
        const data = JSON.parse(msg);

        switch (data.type) {
            case 'join':
                joinRoom(ws, data.threadId);
                break;
            case 'leave':
                leaveRoom(ws, data.threadId);
                break;
            case 'message':
                broadcastToRoom(data.threadId, data.message, ws);
                break;
        }
    });

    ws.on('close', () => {
        if (ws.room) leaveRoom(ws, ws.room);
    });
}

const rooms = new Map();

function joinRoom(ws, threadId) {
    if (!rooms.has(threadId)) rooms.set(threadId, new Set());
    rooms.get(threadId).add(ws);
}

function leaveRoom(ws, threadId) {
    const room = rooms.get(threadId);
    if (!room) return;

    room.delete(ws);

    if (room.size === 0) rooms.delete(threadId);
}

function broadcastToRoom(threadId, message, sender) {
    const room = rooms.get(threadId);
    if (!room) return;

    for (const client of room) {
        if (client !== sender && client.readyState === 1) {
            client.send(JSON.stringify({
                threadId,
                message,
            }));
        }
    }
}