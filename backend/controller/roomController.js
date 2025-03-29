import mongoose from "mongoose";
import Room from "../modules/Room.js";
import { User } from "../modules/User.js";

export const createRoom = async (req, res) => {
    try {
        const { roomId, roomName, ownerId } = req.body;
        console.log(roomId, roomName, ownerId);

        // Validate if ownerId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).json({ message: "Invalid owner ID format" });
        }

        const owner = await User.findById(ownerId);
        console.log("owner: ",owner)
        if (!owner) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create room with owner as the first collaborator
        const newRoom = new Room({
            room_id: roomId,
            room_name: roomName,
            owner: owner._id,
            collaborators: [owner._id], // Owner is added as a collaborator
        });

        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ message: "Server error" });
    }
};




export const getRoomDetails = async (req, res) => {
    try {
        const { roomId } = req.params;
        console.log(roomId);
        const room = await Room.findOne({ room_id: roomId }).populate("collaborators", "username");

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json({
            room_id: room.room_id,
            room_name: room.room_name,
            collaborators: room.collaborators.map((user) => ({ name: user.username })),
        });
    } catch (error) {
        console.error("Error fetching room details:", error);
        res.status(500).json({ message: "Server error" });
    }
};