const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const id = "64dfcabba713913d1f8dcd12";
    const existing = await User.findById(id);

    if (!existing) {
      await User.create({
        _id: id,
        username: "demo",
        balance: 1000
      });

      console.log("✅ Test user created successfully");
    } else {
      console.log("ℹ️ Test user already exists");
    }

    process.exit();
  })
  .catch(err => {
    console.error("❌ Seeder Error:", err.message);
    process.exit(1);
  });
