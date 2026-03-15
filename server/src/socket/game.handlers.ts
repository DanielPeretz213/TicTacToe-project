import { Server, Socket } from "socket.io";


export const registerGameHandlers = (io:Server, socket:Socket) =>{
    socket.on("game:start", () => {
        //אני רוצה לשלוח את מצב ההלוח 
    })
}