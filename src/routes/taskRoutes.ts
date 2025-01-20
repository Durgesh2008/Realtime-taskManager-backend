import { Router } from 'express';
import { addTask, deleteTask, getById, getTasks, updateTask } from '../controllers/taskController';

const router = Router();

router.post('/', addTask);
router.get('/', getTasks);
router.get('/:id', getById);
router.put('/:id',updateTask);
router.delete('/:id',deleteTask);

export default router;
