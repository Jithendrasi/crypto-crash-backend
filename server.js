const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");

const betRoutes = require("./routes/betRoutes");
const walletRoutes = require("./routes/walletRoutes");
const setupSocket = require("./sockets/gameSocket");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/api/bet", betRoutes);
app.use("/api/wallet", walletRoutes);

// WebSocket
setupSocket(io);

// ✅ Corrected: Only one listen block inside async function
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // ✅ removed deprecated options
    console.log("✅ MongoDB connected");

    server.listen(process.env.PORT || 3000, () => {
      console.log("🚀 Server running on port 3000");
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
