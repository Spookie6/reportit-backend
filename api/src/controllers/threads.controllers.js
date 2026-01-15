import * as Thread from '../db/querries/threads.js';

export async function createThread(req, res) {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;
        const newThread = await Thread.createThread(userId, title, content);

        res.status(201).json({ thread: newThread });
    } catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function getMessagesByThreadId(req, res) {
    const messages = await Thread.getMessagesByThreadId(req.params.threadId);
    res.json({ messages });
}