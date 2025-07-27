const axios = require("axios");

let cache = {};
let lastFetched = 0;

exports.getCryptoPrice = async (coinId) => {
  const now = Date.now();

  // Reuse price if it's been fetched within the last 15 seconds
  if (cache[coinId] && now - lastFetched < 15000) {
    return cache[coinId];
  }

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
  const response = await axios.get(url);

  const price = response.data[coinId]?.usd;

  if (!price) throw new Error("Price not found");

  cache[coinId] = price;
  lastFetched = now;

  console.log("🔁 CoinGecko Price Fetched:", coinId, price);
  return price;
};
