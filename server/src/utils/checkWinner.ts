import { SymbolType } from "../models/Room.model";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const checkWinner = (board:(string | null)[], index: number) => {
for (const combination of WINNING_COMBINATIONS){
    const [a, b, c] = combination;

    if(combination.includes(index) && board[a] && board[a] === board[b] && board[a] === board[c]){
        return board[a] as SymbolType;
    }
}
    if(!board.includes(null)){
        return "draw";
    }
    return null;
}
export default checkWinner;