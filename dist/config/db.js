"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.db = void 0;
const mysql2_1 = require("mysql2");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.db = (0, mysql2_1.createPool)({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        exports.db.getConnection((err, connection) => {
            if (err) {
                
                reject(err);
            }
            else {
                
                connection.release();
                resolve();
            }
        });
    });
});
exports.connectToDatabase = connectToDatabase;
