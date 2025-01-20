// src/db.ts
import { createConnection } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const db = createConnection({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
});

export const connectToDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err.message);
        reject(err);
      } else {
        console.log('Connected to the database.');
        resolve();
      }
    });
  });
};
