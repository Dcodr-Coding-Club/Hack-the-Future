import express from "express";
import { getUserDetails,RegisterUser,LoginUser } from "../controller/authController.js";
// import { protect } from "../middleware/authMiddleware.js"; // Middleware to verify token

export const authRoutes = express.Router();

authRoutes.post('/signup', RegisterUser);
authRoutes.post('/login', LoginUser);
authRoutes.get('/user/:userId', getUserDetails);
