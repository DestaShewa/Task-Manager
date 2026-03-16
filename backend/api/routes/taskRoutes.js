import express from 'express';
import { getAllTasks, addTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getAllTasks);
router.post('/', addTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
