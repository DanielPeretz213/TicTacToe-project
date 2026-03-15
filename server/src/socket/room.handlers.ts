import { Server, Socket } from "socket.io";
import { generateRoomCode } from "../utils/generateRoomCode";
import Room from "../models/Room.model";

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  socket.on("room:create", async () => {
    try {
      const roomCode: string = generateRoomCode();
      const newRoom = new Room({
        roomCode,
        players: [{ socketId: socket.id, symbol: "X" }],
        currentTurn: "X",
        status: "waiting",
      });
      await newRoom.save();

      socket.join(roomCode);

      socket.emit("room:created", roomCode);
      console.log(`Room created: ${roomCode} by ${socket.id}`);
    } catch (error) {
      console.error("error creation room", error);
      socket.emit("error", "fild to creation room, try agin");
    }
  });

  socket.on("room:join", async (roomCode: string) => {
    try {
      const roomToJoin = await Room.findOne({ roomCode });

      if (!roomToJoin) {
        return socket.emit(
          "error",
          `room with code room: ${roomCode} not found`,
        );
      }

      if (roomToJoin.players.length >= 2) {
        return socket.emit("error", `room with code room: ${roomCode} is full`);
      }

      roomToJoin.players.push({ socketId: socket.id, symbol: "O" });
      roomToJoin.status = "playing";

      await roomToJoin.save();

      socket.join(roomCode);
      io.to(roomCode).emit("room:joined", roomToJoin);
    } catch (error) {
      console.error("faild to join to the room", error);
      socket.emit("error", "fild to join to theroom, try agin");
    }
  });

  socket.on("room:leave", (roomId: string) => {
    socket.leave(roomId);
    io.to(roomId).emit("room:playerLeft", socket.id);
  });
};
