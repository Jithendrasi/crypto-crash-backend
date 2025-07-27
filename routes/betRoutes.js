const express = require("express");
const router = express.Router();

const betController = require("../controllers/betController");

router.post("/place", betController.placeBet);
router.post("/cashout", betController.cashOut);

module.exports = router;
