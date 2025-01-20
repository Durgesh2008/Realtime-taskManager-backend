import { db } from "../config/db";

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status ENUM('Pending','In Progress','Completed') DEFAULT 'Pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

export const createTaskTable = ()=>{
    db.query(createTableQuery, (err, results) => {
        if (err) {
            console.error('Error creating table:', err.message);
            return;
        }
       
    });
}