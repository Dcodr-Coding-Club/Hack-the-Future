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

        socket.on("send_message", (data) => {
            io.emit("receivedmessage", { message: data.message }); 
        });

        socket.on("codeUpdate",(data)=>{
            io.emit("changeCode", data);
        })
    });
};
