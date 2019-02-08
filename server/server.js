const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const PORT = process.env.PORT || 3333


const app = express();


app.use(express.static(path.join(__dirname, "..", "public")));

const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (socket) => {
  console.log("User connected!");

  socket.on("disconnect", (socket) => {
    console.log("User disconnected!");
  })
});


server.listen(PORT, () => {
  console.log(`Server started: \n http://localhost:${PORT}`);
})
