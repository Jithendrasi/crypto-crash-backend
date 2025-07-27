const crypto = require("crypto");

exports.generateCrashPoint = (seed, round) => {
  const hash = crypto.createHash("sha256").update(seed + round).digest("hex");
  const point = (parseInt(hash.slice(0, 8), 16) % 10000) / 100 + 1;
  return parseFloat(point.toFixed(2));
};