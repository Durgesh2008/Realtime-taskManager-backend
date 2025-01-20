"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql2_1 = require("mysql2");
const TaskTable_1 = require("../Database/TaskTable");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.db = (0, mysql2_1.createConnection)({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
});
(0, TaskTable_1.createTaskTable)();
exports.db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    }
});
