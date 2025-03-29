import express from "express";
import { createRoom, getRoomDetails, joinRoom } from "../controller/roomController.js";

export const roomRoutes = express.Router();

roomRoutes.post("/", createRoom);
roomRoutes.get("/get/:roomId", getRoomDetails);
roomRoutes.post('/join/:roomId', joinRoom);