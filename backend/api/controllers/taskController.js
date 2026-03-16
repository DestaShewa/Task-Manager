import { readDB, writeDB } from '../utils/db.js';

export const getAllTasks = async (req, res) => {
    try {
        const db = await readDB();
        const { userId } = req.query;
        let tasks = db.tasks;
        if (userId) {
            tasks = tasks.filter(t => String(t.userId) === String(userId));
        }
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

export const addTask = async (req, res) => {
    try {
        const db = await readDB();
        const newTask = {
            ...req.body,
            id: Date.now().toString()
        };
        db.tasks.push(newTask);
        await writeDB(db);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error adding task' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();
        const index = db.tasks.findIndex(t => String(t.id) === String(id));
        if (index === -1) return res.status(404).json({ message: 'Task not found' });

        db.tasks[index] = { ...db.tasks[index], ...req.body };
        await writeDB(db);
        res.json(db.tasks[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();
        db.tasks = db.tasks.filter(t => String(t.id) !== String(id));
        await writeDB(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
};
