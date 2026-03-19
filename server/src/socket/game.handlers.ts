import { Server, Socket } from "socket.io";
import RoomModel from "../models/Room.model";
import checkWinner from "../utils/checkWinner";

export const registerGameHandlers = (io:Server, socket:Socket) =>{
    socket.on("game:move", async (roomCode:string, index:number) => {
        const findRoom = await RoomModel.findOne({roomCode});
        if(!findRoom || findRoom.status !== "playing") return;

        const player =  findRoom.players.find(p => p.socketId === socket.id);

        if(player?.symbol !== findRoom.currentTurn){
           return socket.emit("error", "is not your turn");
        }

        if(findRoom.boards[index] !== null){
            return socket.emit("error", " the sell already black ");
        }
        findRoom.boards[index] = player!.symbol;
        findRoom.currentTurn = findRoom.currentTurn === "O" ? "X" : "O";
        const statusWinner = checkWinner(findRoom.boards, index);
        if(statusWinner){
            findRoom.status = "finished";
            findRoom.winner = statusWinner
        }
        await findRoom.save();

        io.to(roomCode).emit("game:update",findRoom);

        if(statusWinner){
            io.to(roomCode).emit("game:finished",{
                winner: statusWinner
            });
        }
    });

    socket.on("game:update",() =>{});

    socket.on("game:finished",() =>{})
}