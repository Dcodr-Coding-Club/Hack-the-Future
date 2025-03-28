import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import connectDB from './config/connectToDatabase.js';
import { authRoutes } from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOption = {
    origin:`http://localhost:5173`, //frontend port
    credentials: true,
};
app.use(cors(corsOption));
app.use(cookieParser());

app.use('/auth', authRoutes);
const PORT = process.env.PORT || 5000;
// http://localhost:3000/auth/
app.listen(PORT, () => {
  console.log(`The Server is Running at port ${PORT}`);
});