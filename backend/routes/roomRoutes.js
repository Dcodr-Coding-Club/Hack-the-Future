import express from "express";
import { createRoom, getRoomDetails } from "../controller/roomController.js";

export const roomRoutes = express.Router();

roomRoutes.post("/", createRoom);
roomRoutes.get("/:roomId", getRoomDetails);