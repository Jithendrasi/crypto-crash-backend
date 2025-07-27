const User = require("../models/user");
const { getCryptoPrice } = require("../services/priceService");

exports.getWallet = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const BTCPrice = await getCryptoPrice("BTC");
  const ETHPrice = await getCryptoPrice("ETH");

  res.json({
    BTC: user.wallet.BTC,
    ETH: user.wallet.ETH,
    USD_Equivalent: {
      BTC: user.wallet.BTC * BTCPrice,
      ETH: user.wallet.ETH * ETHPrice
    }
  });
};