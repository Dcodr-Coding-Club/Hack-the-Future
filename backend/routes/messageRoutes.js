import express from "express";
import { Message } from "../modules/Message.js";

export const messageRoutes = express.Router();

messageRoutes.get("/:roomId", async (req, res) => {
    try {
        const messages = await Message.find({ roomId: req.params.roomId }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});
