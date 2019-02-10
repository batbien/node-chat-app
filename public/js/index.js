$(function() {
  var socket = io.connect("https://192.168.0.103:3333");
  var connecting = false;
  var sender = $('#sender');
  var message = $("#message");
  var chatbox = $("#chatbox");
  var send = $("#send");
  var sendLocation = $("#send-location");

  send.click(function(event) {
    event.preventDefault();
    if (connecting) {
      if (!(sender.val() && message.val()))
        return;
      socket.emit("sendMessage", {
        sender: sender.val(),
        message: message.val(),
      });
    } else {
      let notConnected = document.createElement("li");
      $(notConnected).addClass("not-connected");
      $(notConnected).text("Not connected.");
      chatbox.prepend(notConnected);
    }
  });

  sendLocation.click(function(event) {
    event.preventDefault();
    if (!sender.val())
      return;
    if (!("geolocation" in navigator))
      alert("Geolocation not supported!");
    else {
      navigator.geolocation.getCurrentPosition(
        function(location) {
          socket.emit("sendLocation", {
            sender: sender.val(),
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        },
        function(err) {
          alert("Cannot fetch position!");
          console.log(err);
        }
      );
    }
  });

  socket.on("connect", function() {
    console.log("Connected to server!");
    connecting = true;
  });

  socket.on("disconnect", function() {
    console.log("Disconnected from server!");
    connecting = false;
  });

  socket.on("newMessage", function(message) {
    let msg = document.createElement("li");
    $(msg).html(`<b>${message.sender}:</b> ${message.message}`);
    chatbox.prepend(msg);
  });

  socket.on("newLocation", function(message) {
    let msg = document.createElement("li");
    let msgSender = document.createElement("b");
    let msgBody = document.createElement("a");

    $(msgSender).text(`${message.sender}: `);
    $(msgBody).text("Click to see my location").attr({ "target": "_blank", "href": message.message });

    $(msg).append(msgSender).append(msgBody);
    chatbox.prepend(msg);
  });

});
