import express from 'express'
import { LoginUser, RegisterUser } from '../controller/authController.js';

export const authRoutes = express.Router();

authRoutes.post('/signup', RegisterUser );
authRoutes.post('/login', LoginUser);