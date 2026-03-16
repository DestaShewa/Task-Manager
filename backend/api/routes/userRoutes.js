import express from 'express';
import { getUsers, registerUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', registerUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
