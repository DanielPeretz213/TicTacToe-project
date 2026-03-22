import { model, Schema } from "mongoose";

export type SymbolType = "X" | "O";

export type Player = {
  socketId: string;
  symbol: SymbolType;
};

const PlayerSchema = new Schema<Player>({
  socketId: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    enum: ["X", "O"],
    required: true,
  },
});

export interface RoomProps {
  roomCode: string;
  players: Player[];
  board: (SymbolType | null)[];
  currentTurn: SymbolType;
  status: "waiting" | "playing" | "finished";
  winner: SymbolType | "draw";
  createdAt: Date;
}

const RoomSchema = new Schema<RoomProps>({
  roomCode: {
    type: String,
    required: true,
    unique: true,
  },
  players: {
    type: [PlayerSchema],
    validate: [(arr: Player[]) => arr.length <= 2, "max 2 players"],
    default: [],
  },
  board: {
  type: [String],
  default: [null, null, null, null, null, null, null, null, null],
},

  currentTurn: {
    type: String,
    enum: ["X", "O"],
    default: "X",
  },

  status: {
    type: String,
    enum: ["waiting", "playing", "finished"],
    default: "waiting",
  },

  winner: {
    type: String,
    enum: ["X", "O", "draw"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<RoomProps>("Room", RoomSchema);
