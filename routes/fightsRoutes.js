const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {getUserFightsHistory} = require("../controllers/fightControllee");

const router = express.Router();

router.get("/getFights",protect, getUserFightsHistory);

module.exports = router;