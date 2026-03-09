import express from "express";
import {Server} from "socket.io";
import {createServer} from "http";

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*"
    }
});

io.on("connection", (socket)=>{
    console.log("user cconnsect:", socket.id)
});
