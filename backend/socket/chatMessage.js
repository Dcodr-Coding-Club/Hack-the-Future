import { Server } from "socket.io";

export const initSocket = (server) => { 
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST", "PUT"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId); // Join the specific room
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on("send_message", (data) => {
            io.to(data.roomId).emit("receivedmessage", { username: data.username, message: data.message }); // Emit to specific room with username
        });

        socket.on("codeUpdate", (data) => {
            io.to(data.roomId).emit("changeCode", data.newCode, data.activeFile); // Emit to specific room
        });
    });
};
