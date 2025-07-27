const { getCryptoPrice } = require("../services/priceService");
const Transaction = require("../models/transaction");
const User = require("../models/user");

const currencyMap = {
  BTC: "bitcoin",
  ETH: "ethereum"
};

// 🚀 Place a new bet
exports.placeBet = async (req, res) => {
  try {
    const { userId, usdAmount, currency } = req.body;

    if (!userId || !usdAmount || !currency) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const coinId = currencyMap[currency];
    if (!coinId) {
      return res.status(400).json({ message: "Unsupported currency" });
    }

    const price = await getCryptoPrice(coinId);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < usdAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const cryptoAmount = usdAmount / price;

    const tx = await Transaction.create({
      playerId: userId,
      usdAmount,
      cryptoAmount,
      currency,
      transactionType: "bet",
      priceAtTime: price
    });

    user.balance -= usdAmount;
    await user.save();

    res.status(200).json({ message: "Bet placed", cryptoAmount, transactionId: tx._id });
  } catch (err) {
    console.error("Place Bet Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 💸 Cash out
exports.cashOut = async (req, res) => {
  try {
    const { userId, transactionId, multiplier } = req.body;

    if (!userId || !transactionId || !multiplier) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const bet = await Transaction.findOne({ _id: transactionId, playerId: userId });
    if (!bet) return res.status(404).json({ message: "Bet not found" });
    if (bet.transactionType !== "bet") return res.status(400).json({ message: "Invalid transaction" });

    const payout = (bet.usdAmount * multiplier).toFixed(2);

    // Update user balance
    user.balance += Number(payout);
    await user.save();

    // Save cashout record
    await Transaction.create({
      playerId: userId,
      usdAmount: payout,
      currency: bet.currency,
      transactionType: "cashout",
      priceAtTime: bet.priceAtTime,
      linkedBet: bet._id
    });

    res.status(200).json({ message: "Cashout successful", payout });
  } catch (err) {
    console.error("Cashout Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
