import { Server, Socket } from "socket.io";
import Room from "../models/Room.model";
import checkWinner from "../utils/checkWinner";

export const registerGameHandlers = (io:Server, socket:Socket) =>{
    socket.on("game:move", async (roomCode:string, index:number) => {
        const findRoom = await Room.findOne({roomCode});
        if(!findRoom || findRoom.status !== "playing") return;

        const player =  findRoom.players.find(p => p.socketId === socket.id);

        if(player?.symbol !== findRoom.currentTurn){
            socket.emit("error", "is not your turn");
            return;
        }

        if(findRoom.boards[index] !== null){
            socket.emit("error", " the sell already black ")
            return;
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
    })
}