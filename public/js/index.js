$(function() {
  var socket = io.connect("https://192.168.0.103:3333");
  var connecting = false;
  var sender = $('#sender');
  var message = $("#message");
  var chatbox = $("#chatbox");
  var send = $("#send");
  var sendLocation = $("#send-location");
  var chatForm = $("#chat-form");

  var ctrlDown = false;

  message.on("keydown", function(event) {
    if (!ctrlDown && event.key === "Control")
      ctrlDown = true;
    else if (event.key === "Enter") {
      if (ctrlDown)
        message.val(message.val() + "\n");
      else
        sendMessage(event);
    }
  });

  message.on("keyup", function(event) {
    if (ctrlDown && event.key === "Control")
      ctrlDown = false;

  });

  $(window).blur(function() {
    // In case the user switch tab/window while pressing ctrl
    ctrlDown = false;
  });

  chatForm.on("submit", sendMessage);
  send.click(sendMessage);

  function sendMessage(event) {
    event.preventDefault();
    if (connecting) {
      if (!(sender.val() && message.val()))
        return;
      socket.emit("sendMessage", {
        sender: sender.val(),
        message: message.val(),
      }, function() {
        message.val("");
        message.focus();
      });
    } else {
      let notConnected = document.createElement("li");
      $(notConnected).addClass("not-connected");
      $(notConnected).text("Not connected.");
      chatbox.append(notConnected);
    }
  };

  sendLocation.click(function(event) {
    event.preventDefault();
    if (!sender.val())
      return;
    sendLocation.attr("disabled", "disabled");
    sendLocation.text("processing...");
    if (!("geolocation" in navigator))
      alert("Geolocation not supported!");
    else {
      navigator.geolocation.getCurrentPosition(
        function(location) {
          sendLocation.removeAttr("disabled");
          sendLocation.text("Send my location");
          socket.emit("sendLocation", {
            sender: sender.val(),
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        },
        function(err) {
          sendLocation.removeAttr("disabled");
          sendLocation.text("Send my location");
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
    chatbox.append(msg);
  });

  socket.on("newLocation", function(message) {
    let msg = document.createElement("li");
    let msgSender = document.createElement("b");
    let msgBody = document.createElement("a");

    $(msgSender).text(`${message.sender}: `);
    $(msgBody).text("Click to see my location").attr({ "target": "_blank", "href": message.message });

    $(msg).append(msgSender).append(msgBody);
    chatbox.append(msg);
  });

});
