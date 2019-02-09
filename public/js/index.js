const socket = io("http://localhost:3333");
var connecting = false;
const sender = document.getElementById("sender");
const message = document.getElementById("message");
const chatbox = document.getElementById("chatbox");
const send = document.getElementById("send");

send.addEventListener("click", handleSendClick);

function handleSendClick() {
  if (connecting) {
    socket.emit("sendMessage", { sender: sender.value, message: message.value });
    console.log("sendMessage emitted, data: ", { sender: sender.value, message: message.value });

  } else {
    let notConnected = document.createElement("h5");
    notConnected.className += " not-connected";
    notConnected.textContent = "Not connected."
    chatbox.prepend(notConnected);
  }
}

socket.on("connect", function() {
  console.log("Connected to server!");
  connecting = true;

});

socket.on("disconnect", function() {
  console.log("Disconnected from server!");
  connecting = false;
});

socket.on("broadcastMessage", function(message) {
  let title = document.createElement("h5");
  let body = document.createElement("p");
  // notConnected.className += " not-connected";
  title.textContent = message.sender + ":";
  body.textContent = message.message;
  chatbox.prepend(body);
  chatbox.prepend(title);
});
