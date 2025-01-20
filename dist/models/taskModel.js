"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
const db_1 = require("../config/db");
exports.TaskModel = {
    create: (task, callback) => {
        const sql = 'INSERT INTO tasks (name, status) VALUES (?, ?)';
        db_1.db.query(sql, [task.name, task.status || 'Pending'], (err, result) => {
            if (err)
                return callback(err);
            callback(null, result);
        });
    },
    findAll: (page = 1, pageSize = 10, callback, status, name) => {
        const offset = (page - 1) * pageSize;
        let sql = 'SELECT id, name, status, createdAt FROM tasks';
        let countSql = 'SELECT COUNT(*) AS totalCount FROM tasks';
        const queryParams = [];
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
        db_1.db.query(countSql, queryParams.slice(0, queryParams.length - 2), (err, countResults) => {
            var _a;
            if (err)
                return callback(err, 0, []);
            const totalCount = ((_a = countResults[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
            db_1.db.query(sql, queryParams, (err, results) => {
                if (err)
                    return callback(err, totalCount, []);
                const tasks = results;
                callback(null, totalCount, tasks);
            });
        });
    },
    update: (id, updates, callback) => {
        let sql = 'UPDATE tasks SET ';
        const fields = [];
        const values = [];
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
        db_1.db.query(sql, values, (err, result) => {
            if (err)
                return callback(err);
            callback(null, result);
        });
    },
    findById: (id, callback) => {
        const sql = 'SELECT id, name, status, createdAt FROM tasks WHERE id = ?';
        db_1.db.query(sql, [id], (err, result) => {
            if (err)
                return callback(err);
            if (result.length === 0)
                return callback(null, undefined);
            const task = result[0];
            callback(null, task);
        });
    },
    delete: (id, callback) => {
        const sql = 'DELETE FROM tasks WHERE id = ?';
        db_1.db.query(sql, [id], (err, result) => {
            if (err)
                return callback(err);
            callback(null, result);
        });
    },
};
