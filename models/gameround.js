const mongoose = require("mongoose");
const gameRoundSchema = new mongoose.Schema({
  roundId: Number,
  crashPoint: Number,
  bets: Array,
  cashouts: Array,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GameRound", gameRoundSchema);
