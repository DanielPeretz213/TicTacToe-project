import { Button, Card, Divider, Input, Space, Tag, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { gameStore } from "../stores/GameStore";
import { LoginOutlined, RocketOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;
export const Lobby = observer(() => {
    const [inputCode, setInputCode] = useState("")
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card
        style={{
          width: 400,
          alignItems: "center",
        }}
      >
        <Title level={2}>Tic Tac Toe zGame Online</Title>
        <Text type="secondary">Create room or join to your friend room!</Text>

        <Divider />

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            block
            onClick={() => gameStore.createRoom()}
          >
            Create New Game
          </Button>

          <Divider plain>OR</Divider>

          <Space.Compact style={{width: "100%"}}>
            <Input
            placeholder="Enter Your Room Code!"
            size="large"
            value={inputCode}
            onChange={(e)=> setInputCode(e.target.value.toUpperCase())}
            />
            <Button
            type="default"
            size="large"
            icon={<LoginOutlined/>}
            onClick={()=>gameStore.joinRoom(inputCode)}
            >
                Join
            </Button>
          </Space.Compact>
        </Space>
      </Card>
    </div>
  );
});
