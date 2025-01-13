import { useEffect, useRef, useState } from "react";

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const sendMessage = () => {
    console.log("Message sent");
    const message = inputRef?.current?.value;
    ws?.send(message || "");
  };

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");
    setWs(newSocket);
    newSocket.onopen = () => {
      console.log("Connection opened");
    };

    newSocket.onmessage = (message) => {
      alert("Message received: " + message.data.toString());
    };
  }, []);
  return (
    <div>
      <input type="text" ref={inputRef} placeholder="Message.."></input>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
