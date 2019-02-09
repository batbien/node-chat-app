const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const PORT = process.env.PORT || 3333
var sockets

const app = express();


app.use(express.static(path.join(__dirname, "..", "public")));

const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (socket) => {
  console.log("User connected!");

  socket.on("disconnect", (socket) => {
    console.log("User disconnected!");
  })

  socket.on("sendMessage", (message) => {
    console.log(`Received message from ${message.sender}`);
    // Both work
    // io.sockets.emit("broadcastMessage", message);
    io.emit("broadcastMessage", message);
  })
});


server.listen(PORT, () => {
  console.log(`Server started: \n http://localhost:${PORT}`);
})
