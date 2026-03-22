import { observer } from "mobx-react-lite";
import { gameStore } from "./stores/GameStore";
import { Lobby } from "./components/Lobby";
import { GameBoard } from "./components/GameBoard";
import { ToastContainer } from "react-toastify";

const App = observer(() => {
  return (
    <div className="App" style={{ padding: "20px" }}>
      {!gameStore.roomCode ? <Lobby />: <GameBoard />}


      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
});

export default App;
