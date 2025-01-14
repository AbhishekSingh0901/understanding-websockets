import { WebSocketServer, WebSocket } from "ws";
import http from "http";

const server = http.createServer(function (request: any, response: any) {
  console.log(new Date() + " Received request for " + request.url);
});

const wss = new WebSocketServer({ server });
const allRooms = new Map<string, WebSocket[]>();

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (data: string) => {
    const message = JSON.parse(data);
    if (message.type === "join") {
      const { room } = message;
      if (!allRooms.has(room)) {
        allRooms.set(room, []);
      }
      allRooms.get(room)?.push(ws);
      console.log(new Date() + ` Client joined room ${room}`);
      return;
    }

    const { room } = message;
    const clients = allRooms.get(room);
    clients?.forEach((client) => {
      if (client !== ws) {
        client.send(JSON.stringify({ text: message.text }));
      }
    });
  });
});

server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});
