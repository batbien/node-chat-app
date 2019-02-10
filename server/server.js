const path = require("path");
const fs = require("fs");
const express = require("express");
const https = require("https");
const socketio = require("socket.io");

const { createMessage, createLocationMessage } = require("./utils/MessageCreator");

const PORT = process.env.PORT || 3333
var sockets

const app = express();


app.use(express.static(path.join(__dirname, "..", "public")));

const server = https.createServer({
  key: fs.readFileSync("server/secret/chatapp-key.pem"),
  cert: fs.readFileSync("server/chatapp.cert")
}, app);

const io = socketio(server);

io.on("connection", (socket) => {
  console.log("User connected!");

  // Say hello to new user
  socket.emit("newMessage",
    createMessage("admin", "Hi! Welcome to NOdE cHAt aPp!"));

  // announce new user has joined
  socket.broadcast.emit("newMessage",
    createMessage("admin", "New user has just joined."));

  socket.on("disconnect", (socket) => {
    console.log("User disconnected!");
  });

  socket.on("sendMessage", (message) => {
    console.log(`Received message from ${message.sender}`);
    io.emit("newMessage", message);
    // socket.broadcast.emit("broadcastMessage", message);
  });

  socket.on("sendLocation", (location) => {
    console.log(`Received location from ${location.sender}`);
    io.emit("newLocation", createLocationMessage(
      location.sender, location.latitude, location.longitude));
  })
});


server.listen(PORT, () => {
  console.log(`Server started: \n https://localhost:${PORT}\n https://192.168.0.103:${PORT}`);
})
