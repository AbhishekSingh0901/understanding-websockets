import { WebSocketServer } from "ws";
import http from "http";

const server = http.createServer(function (request: any, response: any) {
  console.log(new Date() + " Received request for " + request.url);
});

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    if (data.toString() === "ping") {
      ws.send("pong");
    }
  });
});

server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});
