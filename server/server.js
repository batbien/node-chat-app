const path = require("path");
const fs = require("fs");
const express = require("express");
const https = require("https");
const socketio = require("socket.io");

const { createMessage, createLocationMessage } = require("./utils/MessageCreator");
const { validateStr } = require("./utils/Validation");
const { Users } = require("./utils/Users");

const PORT = process.env.PORT || 3333
var sockets

const app = express();
const users = new Users();

app.use(express.static(path.join(__dirname, "..", "public")));

const server = https.createServer({
  key: fs.readFileSync("server/secret/chatapp-key.pem"),
  cert: fs.readFileSync("server/chatapp.cert")
}, app);

const io = socketio(server);

io.on("connection", (socket) => {
  console.log("[+] User connected!");

  // Say hello to new user
  socket.emit("newMessage",
    createMessage("Admin", "Hi! Welcome to NOdE cHAt aPp!"));

  socket.on("join", (userInfo, cb) => {
    if (!validateStr(userInfo.username) || !validateStr(userInfo.room)) {
      console.log("[-] Invalid user information");
      cb("Invalid user information");
    } else {
      // Add user to list
      users.removeUser(socket.id);
      let user = users.addUser(socket.id, userInfo.username, userInfo.room);
      socket.join(user.room);

      // Announce new user has joined
      io.to(user.room).emit("newMessage",
        createMessage("Admin", `${user.username} has joined.`));

      // Broadcast the new user list to the room
      io.to(user.room).emit("newUserList", users.getUserList(user.room));

      // Send acknowledgement
      cb();
    }
  });

  socket.on("sendMessage", (message, cb) => {
    let user = users.getUser(socket.id);
    io.to(user.room).emit("newMessage", message);
    cb();
  });

  socket.on("sendLocation", (location) => {
    let user = users.getUser(socket.id);
    io.to(user.room).emit("newLocation", createLocationMessage(
      location.sender, location.latitude, location.longitude));
  });

  socket.on("disconnect", () => {
    // Remove user from list
    let user = users.removeUser(socket.id);
    console.log(user);
    if (user) {
      // announce user has left
      io.to(user.room).emit("newMessage",
        createMessage("Admin", `${user.username} has left.`));

      // Broadcast the new user list to the room
      io.to(user.room).emit("newUserList", users.getUserList(user.room));

      console.log(`[-] User ${user.username} disconnected.`);
    } else
      console.log(`[-] User disconnected.`);
  });
});


server.listen(PORT, () => {
  console.log(`Server started: \n https://localhost:${PORT}\n https://192.168.0.103:${PORT}`);
})
