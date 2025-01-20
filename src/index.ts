import express, { Express } from "express";
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import taskRoutes from './routes/taskRoutes';
import dotenv from "dotenv";
import { connectToDatabase } from "./config/db";

dotenv.config();
const app: Express = express();
const server = http.createServer(app);
const corsOptions = {
  origin:process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
export const io = new Server(server, {
  cors:corsOptions
});

app.use(cors(corsOptions));
app.use(express.json());
const port = process.env.PORT||5000;
connectToDatabase()

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});


app.use('/tasks', taskRoutes);


server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
