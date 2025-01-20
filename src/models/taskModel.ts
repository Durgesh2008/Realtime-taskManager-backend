import { db } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

type Task = {
  id?: number;
  name: string;
  status?: 'Pending' | 'In Progress' | 'Completed';
  createdAt?: string;
};

export const TaskModel = {
  create: (task: Task, callback: (err: Error | null, result?: ResultSetHeader) => void) => {
    const sql = 'INSERT INTO tasks (name, status) VALUES (?, ?)';
    db.query<ResultSetHeader>(sql, [task.name, task.status || 'Pending'], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },

  findAll: (
    page: number = 1,
    pageSize: number = 10,
    callback: (err: Error | null, totalCount: number, results?: Task[]) => void,
    status?: string,
    name?: string, 
   
  ) => {
    const offset = (page - 1) * pageSize;
    
    let sql = 'SELECT id, name, status, createdAt FROM tasks';
    let countSql = 'SELECT COUNT(*) AS totalCount FROM tasks';
    const queryParams: (string | number)[] = [];
  
    if (status || name) {
      sql += ' WHERE';
      countSql += ' WHERE';
  
      let filterCount = 0;
  
      if (status) {
        sql += ' status = ?';
        countSql += ' status = ?';
        queryParams.push(status);
        filterCount++;
      }
  
      if (name) {
        if (filterCount > 0) {
          sql += ' AND';
          countSql += ' AND';
        }
        sql += ' name LIKE ?';
        countSql += ' name LIKE ?';
        queryParams.push(`%${name}%`);
      }
    }
    sql += ' ORDER BY createdAt DESC';
    sql += ' LIMIT ? OFFSET ?';
    queryParams.push(pageSize, offset);
  
    db.query<RowDataPacket[]>(countSql, queryParams.slice(0, queryParams.length - 2), (err, countResults) => {
      if (err) return callback(err, 0, []);
  
      const totalCount = countResults[0]?.totalCount || 0;
  
      db.query<RowDataPacket[]>(sql, queryParams, (err, results) => {
        if (err) return callback(err, totalCount, []);
  
        const tasks = results as Task[];
        callback(null, totalCount, tasks);
      });
    });
  },
  

  update: (
    id: number,
    updates: { status?: 'Pending' | 'In Progress' | 'Completed'; name?: string },
    callback: (err: Error | null, result?: ResultSetHeader) => void
  ) => {
    let sql = 'UPDATE tasks SET ';
    const fields: string[] = [];
    const values: any[] = [];
  
    if (updates.status) {
      fields.push('status = ?');
      values.push(updates.status);
    }
  
    if (updates.name) {
      fields.push('name = ?');
      values.push(updates.name);
    }
  
    if (fields.length === 0) {
      return callback(new Error('No fields to update'));
    }
  
    sql += fields.join(', ') + ' WHERE id = ?';
    values.push(id);
  
    db.query<ResultSetHeader>(sql, values, (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },
  
  findById: (id: number, callback: (err: Error | null, result?: Task) => void) => {
    const sql = 'SELECT id, name, status, createdAt FROM tasks WHERE id = ?';
    db.query<RowDataPacket[]>(sql, [id], (err, result) => {
      if (err) return callback(err);
  
      if (result.length === 0) return callback(null, undefined);
  
      const task: Task = result[0] as Task;
      callback(null, task);
    });
  },
  
  delete: (id: number, callback: (err: Error | null, result?: ResultSetHeader) => void) => {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query<ResultSetHeader>(sql, [id], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },
};
