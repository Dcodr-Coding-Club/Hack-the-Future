import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectToDatabase.js';
import { authRoutes } from './routes/authRoutes.js';
import { codeRoutes } from './routes/codeRoutes.js';
import { roomRoutes } from './routes/roomRoutes.js';
import { createServer } from 'node:http';
import { initSocket } from './socket/chatMessage.js';
import fileRoutes from "./routes/fileRoutes.js";
import { messageRoutes } from "./routes/messageRoutes.js";


dotenv.config();
connectDB();

const app = express();
const server = createServer(app); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOption = {
  origin: `http://localhost:5173`,
  credentials: true,
};
app.use(cors(corsOption));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/code', codeRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/messages", messageRoutes);

app.use("/api", fileRoutes);

initSocket(server); 

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`The Server is Running at port ${PORT}`);
});
