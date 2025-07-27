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

// ✅ Allow cross-origin from any frontend (especially Netlify)
app.use(cors({
  origin: "*", // You can restrict this to Netlify URL like "https://your-site.netlify.app"
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// ✅ Routes
app.use("/api/bet", betRoutes);
app.use("/api/wallet", walletRoutes);

// ✅ Health check route for Render or Netlify
app.get("/", (req, res) => {
  res.send("✅ Crypto Crash Backend is Running!");
});

// ✅ WebSocket with CORS
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this to your frontend origin
    methods: ["GET", "POST"]
  }
});

// ✅ Setup game socket
setupSocket(io);

// ✅ MongoDB & Server boot
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
