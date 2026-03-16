import { readDB, writeDB } from '../utils/db.js';

export const getUsers = async (req, res) => {
    try {
        const db = await readDB();
        res.json(db.users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

export const registerUser = async (req, res) => {
    try {
        const db = await readDB();
        const newUser = {
            ...req.body,
            id: Date.now().toString(),
            role: req.body.role || 'user'
        };
        db.users.push(newUser);
        await writeDB(db);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();
        const index = db.users.findIndex(u => String(u.id) === String(id));
        if (index === -1) return res.status(404).json({ message: 'User not found' });

        db.users[index] = { ...db.users[index], ...req.body };
        await writeDB(db);
        res.json(db.users[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();
        db.users = db.users.filter(u => String(u.id) !== String(id));
        // Also remove user's tasks
        db.tasks = db.tasks.filter(t => String(t.userId) !== String(id));
        await writeDB(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};
