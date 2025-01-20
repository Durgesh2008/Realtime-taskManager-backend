import { Request, Response } from 'express';
import { TaskModel } from '../models/taskModel';
import { io } from '..';

export const addTask = (req: Request, res: Response): any => {
  const { name, status } = req.body;
  if (!name) {
    return res.status(400).json("name is required")
  }
  TaskModel.create({ name, status }, (err: any, result: any) => {
    if (err) return res.status(500).json({ error: err.message });
    io.emit('task_updated', { action: 'create', msg: `new task(${result.insertId}) added successfully ` });
    return res.status(201).json({ id: result.insertId, name, status: status || 'Pending' });
  });
};

export const getTasks = (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const q = req.query.search as string;
  const status = req.query.status as string | undefined;

  TaskModel.findAll(page, pageSize, (err: any, totalCount: number, results: any) => {
    if (err) return res.status(500).json({ error: err.message });

    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      tasks: results,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        pageSize,
      },
    });
  }, status, q);
};

export const updateTask = (req: Request, res: Response): any => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json("Valid task id is required")
  }
  const { status, name } = req.body;
  if ((!status && !name)) {
    return res.status(400).json("status or name is required")
  }
  TaskModel.update(Number(id), { status: status, name: name }, (err: any, result: any) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
    io.emit('task_updated', { action: 'update', msg: `task id ${id} is updated` });
    res.status(200).json({ id, status, name });
  });
};


export const deleteTask = (req: Request, res: Response): any => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json("Valid task id is required")
  }
  TaskModel.delete(Number(id), (err: any, result: any) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
    io.emit('task_updated', { action: 'delete', msg: `Task id ${id} deleted successfully` });
    return res.status(200).json({ message: 'Task deleted successfully', id });
  });
};


export const getById = (req: Request, res: Response): any => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json("Valid task id is required")
  }
  TaskModel.findById(Number(id), (err, task) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else if (!task) {
      return res.status(404).json({ error: "task not found" });
    } else {
      return res.status(200).send(task)
    }
  });
}