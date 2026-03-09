import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

server.listen(process.env.PORT, () => {
  console.log("listen to port", process.env.PORT);
});
