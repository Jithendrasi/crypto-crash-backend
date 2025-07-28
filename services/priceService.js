const axios = require("axios");

const cache = {};           // Stores price per coinId
const lastFetched = {};     // Stores timestamp per coinId

const CACHE_DURATION = 60000; // 60 seconds (can reduce to 15000 = 15 sec if needed)

exports.getCryptoPrice = async (coinId, retries = 2) => {
  const now = Date.now();

  //  Return from cache if within duration
  if (cache[coinId] && lastFetched[coinId] && now - lastFetched[coinId] < CACHE_DURATION) {
    console.log("✅ Returning cached price for", coinId, cache[coinId]);
    return cache[coinId];
  }

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
    const response = await axios.get(url);
    const price = response.data[coinId]?.usd;

    if (!price) {
      throw new Error("❌ Price not found in API response");
    }

    cache[coinId] = price;
    lastFetched[coinId] = now;
    console.log("🔁 CoinGecko Price Fetched:", coinId, price);

    return price;

  } catch (error) {
    console.warn("⚠️ Error fetching price:", error.message);

    // Retry if allowed
    if (retries > 0) {
      console.log(`🔄 Retrying (${retries})...`);
      await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms
      return exports.getCryptoPrice(coinId, retries - 1);
    } else {
      throw new Error("❌ Failed to fetch price after retries");
    }
  }
};
