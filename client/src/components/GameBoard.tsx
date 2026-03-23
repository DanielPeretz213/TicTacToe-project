import { observer } from "mobx-react-lite";
import { Button, Card, Tag, Typography } from "antd";
import { gameStore } from "../stores/GameStore";

const { Title } = Typography;

export const GameBoard = observer(() => {
  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
      <Card
        title={<Title level={4}>Room: {gameStore.roomCode}</Title>}
        extra={<Tag color="blue">{gameStore.status.toUpperCase()}</Tag>}
      >
        <div style={{marginBottom: 20}}>
            {gameStore.isMyTurn ? (
                <Tag color="green" style={{fontSize:"1.1rm", padding: "5px 15px"}}>Your Turn{gameStore.mySymbol}</Tag>
            ) :(
                <Tag color="orange" style={{fontSize:"1.1rm", padding: "5px 15px"}}>Opponent's Turn...</Tag>
            )}
        </div>

        <div
        style={{
            display: "grid",
            gridTemplateColumns:"repeat(3, 1fr)",
            gap: "12px"
        }}>
            {gameStore.board.map((cell,index) => (
                <Button
                key={index}
                onClick={()=>gameStore.makeMove(index)}
                disabled={!!cell || !gameStore.isMyTurn || gameStore.status === "finished"}
                style={{
                height: "100px",
                fontSize: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                background: cell ? "#f5f5f5" : "#fff"
              }}
              >
                <span style={{ color: cell === 'X' ? '#1890ff' : '#f5222d' }}>
                    {cell}
                </span>
              </Button>
            ))}
        </div>

        <Button color="blue" onClick={() => gameStore.leaveRoom()}>Back to Home</Button>

        {gameStore.status === "finished" ? (
          <Button color="blue" onClick={() => gameStore.restart()}>restart</Button>
        ):""}
      </Card>
    </div>
  );
});
