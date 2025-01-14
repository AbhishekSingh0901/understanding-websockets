import { useRef, useState } from "react";

function App() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const joinRoom = () => {
    const newSocket = new WebSocket("ws://localhost:8080");
    newSocket.onopen = () => {
      newSocket.send(JSON.stringify({ type: "join", room }));
      setJoined(true);
    };
    newSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data.text || ""]);
    };
    setWs(newSocket);
  };

  const sendMessage = () => {
    if (ws && inputRef.current?.value) {
      ws.send(
        JSON.stringify({ type: "message", text: inputRef.current.value, room })
      );
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      {!joined ? (
        <div>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Enter room name"
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <div>
            {messages.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
          <input type="text" ref={inputRef} placeholder="Message..." />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
