$(function() {
  var socket = io.connect("https://192.168.0.103:3333");
  var connecting = false;
  var message = $("#message");
  var chatbox = $("#chatbox");
  var chatboxContainer = $("#chatbox-container");
  var send = $("#send");
  var sendLocation = $("#send-location");
  var chatForm = $("#chat-form");
  var userList = $("#user-list");
  var loading = $("#loading");
  var chatlineMsgTemplate = $("#chatline-msg-template");
  var chatlineLocationTemplate = $("#chatline-location-template");
  var userlistItemTemplate = $("#userlist-li-template");

  var ctrlDown = false;
  var sender;

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

  function autoScroll() {
    var clientHeight = chatboxContainer.prop("clientHeight");
    var scrollTop = chatboxContainer.prop("scrollTop");
    var scrollHeight = chatboxContainer.prop("scrollHeight");
    var lastHeight = chatbox.children().last().innerHeight();
    var secondLastHeight = $("#chatbox li:nth-last-child(2)").innerHeight();
    if (scrollTop + clientHeight + secondLastHeight + lastHeight >= scrollHeight)
      chatboxContainer.prop("scrollTop", scrollHeight);
  }

  $(window).blur(function() {
    // In case the user switch tab/window while pressing ctrl
    ctrlDown = false;
  });

  chatForm.on("submit", sendMessage);
  send.click(sendMessage);

  function sendMessage(event) {
    event.preventDefault();
    if (connecting) {
      if (!message.val())
        return;
      socket.emit("sendMessage", {
        sender,
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
            sender,
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
    sender = $.deparam(window.Location.search).username;
    socket.emit("join", $.deparam(window.Location.search), (err) => {
      if (err)
        window.location = "/";
      else {
        console.log("ok");
        loading.hide();
        message.focus();
        connecting = true;
      }
    })
  });

  socket.on("disconnect", function() {
    console.log("Disconnected from server!");
    connecting = false;
  });

  socket.on("newMessage", function(message) {
    let sentAt = moment(message.sentAt).format("h:mm a");
    chatbox.html(chatbox.html() + Mustache.render(
      chatlineMsgTemplate.html(), { sentAt, sender: message.sender, message: message.message }));
    autoScroll();
  });

  socket.on("newLocation", function(message) {
    let sentAt = moment(message.sentAt).format("h:mm a");
    chatbox.html(chatbox.html() + Mustache.render(
      chatlineLocationTemplate.html(), { sentAt, sender: message.sender, href: message.message }));
    autoScroll();
  });

  socket.on("newUserList", function(list) {

      let html = "";
      list.forEach(function(name) {
          html += Mustache.render(userlistItemTemplate.html(), { username: name });
          console.log(html);
      });
      userList.html(html);
  });

});
