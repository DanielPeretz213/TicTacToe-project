import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { connectDB } from "./utils/connectDB";
import { initSocket } from "./socket/initSocket";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

 connectDB();
 initSocket(io);

server.listen(process.env.PORT, () => {
  console.log("listen to port", process.env.PORT);
});
