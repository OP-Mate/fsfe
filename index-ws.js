const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);

server.listen(3000, function () {
  console.log("Server started on port 3000");
});

// Begin websockets

const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(socket) {
  const numClients = wss.clients.size;
  console.log("Clients connected ", numClients);

  wss.broadcast(`Current clients ${numClients}`);

  if (socket.readyState === socket.OPEN) {
    socket.send("Welcome to my server");
  }

  socket.on("close", function close() {
    console.log("A client has disconnected");
    wss.broadcast(`Current clients ${numClients}`);
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
