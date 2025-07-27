let currentMultiplier = 1.0;
let crashPoint = 2.0;

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.emit("roundStart", { message: "Round started" });

    let interval = setInterval(() => {
      currentMultiplier += 0.1;
      io.emit("multiplierUpdate", { multiplier: currentMultiplier });

      if (currentMultiplier >= crashPoint) {
        io.emit("roundCrash", { crashPoint });
        clearInterval(interval);
        currentMultiplier = 1.0;
      }
    }, 100);

    socket.on("disconnect", () => console.log("Client disconnected"));
  });
};
