import { Server, Socket } from "socket.io";
import { generateRoomCode } from "../utils/generateRoomCode";

export const registerRoomHandlers = (io:Server, socket:Socket) =>{
    socket.on("room:create",()=>{
        const roomid:string = generateRoomCode();
        socket.join(roomid);
        socket.emit("room:create", roomid)
    });

    socket.on("room:join", (roomId:string) => {
        socket.join(roomId);
        io.to(roomId).emit("player:joined",socket.id)
    })
}