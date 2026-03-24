import { Server, Socket } from "socket.io";
import { registerRoomHandlers } from "./room.handlers";
import { registerGameHandlers } from "./game.handlers";


export const initSocket = (io:Server) => {
    io.on("connection",(socket:Socket)=>{
        console.log("user connected:", socket.id);

        registerRoomHandlers(io, socket);
        registerGameHandlers(io, socket);
    })
}