import { Server, Socket } from "socket.io";


export const initSocket = (io:Server) => {
    io.on("connection",(socket:Socket)=>{
        console.log("user connected:", socket.id);
        
    })
}