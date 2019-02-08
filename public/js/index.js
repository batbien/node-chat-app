

  const socket = io("http://localhost:3333");

  socket.on("connect", () => {
    console.log("Connected to server!");

  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server!");
  });
