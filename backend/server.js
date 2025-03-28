import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import connectDB from './config/connectToDatabase.js';
dotenv.config();

connectDB();

const app = express();

const corsOption = {
    origin: `http://localhost:5173`, //frontend port
    credentials: true,
};
app.use(cors(corsOption));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
  console.log(`The Server is Running at port ${PORT}`);
});