import express from "express";
import { createRoom, getRoomDetails, getRooms, joinRoom } from "../controller/roomController.js";
import { FileUpload, getFiles, getspecificFile } from "../controller/FileController.js";

export const roomRoutes = express.Router();

roomRoutes.post("/", createRoom);
roomRoutes.get("/get/:roomId", getRoomDetails);
roomRoutes.post('/join/:roomId', joinRoom);
roomRoutes.post('/file/upload',FileUpload);
roomRoutes.get('/file/get/:roomId', getFiles);
roomRoutes.get('/file/specificFile/:fileId', getspecificFile);
roomRoutes.get('/getrooms/:userId', getRooms);
