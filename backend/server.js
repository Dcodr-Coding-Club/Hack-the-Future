import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectToDatabase.js';
import { authRoutes } from './routes/authRoutes.js';
import { codeRoutes } from './routes/codeRoutes.js';
import { initializeSocket } from './sockets/socketManager.js'; 
import http from 'http';
import { roomRoutes } from './routes/roomRoutes.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = initializeSocket(server);   // Initialize Socket.io

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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`The Server is Running at port ${PORT}`);
});
