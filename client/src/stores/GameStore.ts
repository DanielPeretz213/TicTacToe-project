import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

class GameStore {
  socket: Socket;
  roomCode: string = "";
  board: (string | null)[] = Array(9).fill(null);
  mySymbol: "X" | "O" | null = null;
  isMyTurn: boolean = false;
  status: "waiting" | "playing" | "finished" = "waiting";
  error: string | null = null;

  constructor() {
    this.socket = io("http://localhost:3000");
    makeAutoObservable(this);
    this.setupListeners;
  }

  setupListeners() {
    this.socket.on("room:created", (code: string) => {
      this.roomCode = code;
      this.mySymbol = "X";
      this.status = "waiting";
    });

    this.socket.on("room:joined", (roomData: any) => {
      this.roomCode = roomData.roomCode;
      this.board = roomData.board;
      if (!this.mySymbol) this.mySymbol = "O";
      this.status = roomData.status;
      this.isMyTurn = roomData.currentTurn === this.mySymbol;
    });

    this.socket.on("error", (msg: string) => {
      this.error = msg;
    });

    this.socket.on("game:update", (roomData: any) =>{
        this.board = roomData.boards;
        this.status = roomData.status;
        this.isMyTurn = roomData.currentTurn === this.mySymbol;
    });

    this.socket.on("game:finished", ({ winner }: { winner: string })=>{
        if(winner === "draw"){
            toast.info("is draw! 🤝");
        }else{
            winner === this.mySymbol ? toast.success("you win🎉🏆") : toast.error("you loss");
            
        }
    });
  }

  createRoom() {
    this.socket.emit("room:create");
  }

  joinRoom(code: string) {
    this.socket.emit("roon:join", code);
  }

  makeMove(index: number) {
    if (
      !this.isMyTurn ||
      this.board[index] !== null ||
      this.status !== "playing"
    ) {
      return;
    }
    this.socket.emit("game:move", { roomcode: this.roomCode, index });
  }
}

export const gameStore = new GameStore();
