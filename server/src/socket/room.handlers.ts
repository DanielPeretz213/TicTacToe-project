import { Server, Socket } from "socket.io";
import { generateRoomCode } from "../utils/generateRoomCode";
import RoomModel from "../models/Room.model";

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  socket.on("room:create", async () => {
    console.log(2)
    try {
      const roomCode: string = generateRoomCode();
      const newRoom = new RoomModel({
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
    console.log(1)
    try {
      const roomToJoin = await RoomModel.findOne({ roomCode });

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

      console.log(roomToJoin);
      await roomToJoin.save();

      socket.join(roomCode);
      io.to(roomCode).emit("room:joined", roomToJoin);
    } catch (error) {
      console.error("faild to join to the room", error);
      socket.emit("error", "fild to join to theroom, try agin");
    }
  });

  socket.on("room:leave", async (roomId: string) => {
    try {
      const findRoom = await RoomModel.findOne({ roomCode: roomId });
      if (!findRoom) {
        return socket.emit("error", "can't find room to left");
      }
      socket.leave(roomId);
      io.to(roomId).emit("room:playerLeft", socket.id);
    } catch (error) {
      socket.emit("error", "faild to leave room");
    }
  });
};
