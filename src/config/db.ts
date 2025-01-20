import { createConnection } from 'mysql2';
import { createTaskTable } from '../Database/TaskTable';
import dotenv from "dotenv";

dotenv.config();

export const db = createConnection({
    host: process.env.HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DATABASE ,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, 
});


createTaskTable()
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    }
});