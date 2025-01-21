"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
exports.io = new socket_io_1.Server(server, {
    cors: corsOptions
});
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
const port = process.env.PORT || 5000;
(0, db_1.connectToDatabase)().catch((err) => {
    process.exit(1);
});
exports.io.on('connection', (socket) => {
    
    socket.on('disconnect', () => {
        
    });
});
app.use('/tasks', taskRoutes_1.default);
server.listen(port, () => {
    
});
