import { Server } from "socket.io";

const rooms = new Map();

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join-room", ({ roomId, userId }) => {
            if (!rooms.has(roomId)) rooms.set(roomId, []);
            rooms.get(roomId).push(userId);
            socket.join(roomId);
            console.log(`User ${userId} joined room ${roomId}`);
            io.to(roomId).emit("user-joined", userId);
        });

        socket.on("code-change", ({ roomId, code }) => {
            socket.to(roomId).emit("update-code", code);
        });

        socket.on("disconnect", () => {
            for (let [roomId, users] of rooms.entries()) {
                rooms.set(roomId, users.filter(user => user !== socket.id));
                if (rooms.get(roomId).length === 0) rooms.delete(roomId);
            }
            console.log("User disconnected:", socket.id);
        });

    });

    return io;
};
