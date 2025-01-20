"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskTable = void 0;
const db_1 = require("../config/db");
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status ENUM('Pending','In Progress','Completed') DEFAULT 'Pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;
const createTaskTable = () => {
    db_1.db.query(createTableQuery, (err, results) => {
        if (err) {
            console.error('Error creating table:', err.message);
            return;
        }
    });
};
exports.createTaskTable = createTaskTable;
