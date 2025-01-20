import express, { Express } from "express";
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import taskRoutes from './src/routes/taskRoutes'
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();
const server = http.createServer(app);
const corsOptions = {
  origin: 'https://realtime-task-manager.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());


io.on('connection', (socket) => {
  socket.on('disconnect', () => {
  });
});


app.use('/tasks', taskRoutes);

const port = process.env.PORT || 3000;
server.listen(port);