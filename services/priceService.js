const axios = require("axios");

const cache = {};
const lastFetched = {};

const CACHE_DURATION = 60000; // 60 seconds

exports.getCryptoPrice = async (coinId, retries = 2) => {
  const now = Date.now();

  if (cache[coinId] && lastFetched[coinId] && now - lastFetched[coinId] < CACHE_DURATION) {
    return cache[coinId];
  }

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
    const response = await axios.get(url);
    const price = response.data[coinId]?.usd;

    if (!price) throw new Error("Price not found");

    cache[coinId] = price;
    lastFetched[coinId] = now;

    console.log("✅ Fetched fresh price:", coinId, price);
    return price;

  } catch (error) {
    console.error("⚠️ Error fetching price:", error.message);

    if (retries > 0) {
      console.log(`🔄 Retrying (${retries})...`);
      await new Promise(res => setTimeout(res, 500));
      return exports.getCryptoPrice(coinId, retries - 1);
    }

    if (cache[coinId]) {
      console.log("🟡 Using stale cached price:", coinId, cache[coinId]);
      return cache[coinId];
    }

    // 🚨 Fallback if all fails
    const fallbackPrice = coinId === "bitcoin" ? 60000 : 4000;
    console.warn("🚨 Using fallback price:", fallbackPrice);
    return fallbackPrice;
  }
};
