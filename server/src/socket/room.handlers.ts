import { Server, Socket } from "socket.io";
import { generateRoomCode } from "../utils/generateRoomCode";
import RoomModel from "../models/Room.model";

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  socket.on("room:create", async () => {
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

      await roomToJoin.save();

      socket.join(roomCode);
      io.to(roomCode).emit("room:joined", roomToJoin);
    } catch (error) {
      console.error("faild to join to the room", error);
      socket.emit("error", "fild to join to theroom, try agin");
    }
  });

  socket.on("room:leave", async (roomCode: string) => {
    try {
      const findRoom = await RoomModel.findOne({ roomCode });
      if (!findRoom) {
        return socket.emit("error", "can't find room to left");
      }
      io.to(roomCode).emit("game:closed");
      // await RoomModel.deleteOne({ _id: findRoom._id });
      socket.leave(roomCode);

      console.log(
        `User ${socket.id} manually left room ${roomCode} - Room deleted`,
      );
    } catch (error) {
      socket.emit("error", "faild to leave room");
    }
  });

  socket.on("disconnect", async () => {
    try {
      console.log("user disconnect:", socket.id);
      const findRoom = await RoomModel.findOne({
        "players.socketId": socket.id,
      });

      if (findRoom) {
        await RoomModel.deleteOne({ _id: findRoom._id });

        socket
          .to(findRoom.roomCode)
          .emit("error", "the other player was left!");
        socket.to(findRoom.roomCode).emit("game:closed");
      }
    } catch (error) {
      console.error("Error in departure:", error);
      return socket.emit("error", "sasamting went wrong with disconnect");
    }
  });
};
