import { observer} from "mobx-react-lite";
import { gameStore } from "./stores/GameStore";

const App = observer(() => {
    return(
        <div>
            <h1>Tic Tac Toe </h1>
            {gameStore.roomCode ? (
                <p>room code is:{gameStore.roomCode}</p> 
            ) : (
                <button onClick={()=> gameStore.createRoom()}>create room</button>
            ) }
            
       </div>
    )
});

export default App;