import { Server, Socket } from "socket.io";
import RoomModel from "../models/Room.model";
import checkWinner from "../utils/checkWinner";

export const registerGameHandlers = (io: Server, socket: Socket) => {
  socket.on(
    "game:move",
    async ({ roomCode, index }: { roomCode: string; index: number }) => {
      try {
        const findRoom = await RoomModel.findOne({ roomCode });
        if (!findRoom || findRoom.status !== "playing") return;

        const player = findRoom.players.find((p) => p.socketId === socket.id);

        if (player?.symbol !== findRoom.currentTurn) {
          return socket.emit("error", "is not your turn");
        }

        if (findRoom.board[index] !== null) {
          return socket.emit("error", " the sell already black ");
        }
        const newBoard = [...findRoom.board];
        newBoard[index] = player.symbol;
        findRoom.board = newBoard;

        findRoom.currentTurn = findRoom.currentTurn === "O" ? "X" : "O";

        const statusWinner = checkWinner(findRoom.board, index);
        if (statusWinner) {
          findRoom.status = "finished";
          findRoom.winner = statusWinner;
        }
        await findRoom.save();

        io.to(roomCode).emit("game:update", findRoom);

        if (statusWinner) {
          io.to(roomCode).emit("game:finished", {
            winner: statusWinner,
          });
        }
      } catch (err) {
        console.error("Move error:", err);
      }
    },
  );

  socket.on("game:restart", async (roomCode: string) => {
    try {
      const findRoom = await RoomModel.findOne({ roomCode });

      if (!findRoom) {
        return socket.emit("error", "room not found");
      }
      if (findRoom.players.length < 2) {
        return socket.emit(
          "error",
          "can't  restart the game becuse the oter pleyer was left",
        );
      }
      findRoom.board = Array(9).fill(null);
      findRoom.status = "playing";
      findRoom.winner = "draw";

      await findRoom.save();

      io.to(roomCode).emit("game:update", findRoom);
    } catch (err) {
      console.error("restart error ", err);
    }
  });
};
