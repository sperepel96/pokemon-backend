const express = require("express");
const {registerOrLogin, verifySignature, getProfile} = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerOrLogin);
router.post("/verify", verifySignature);
router.get("/profile", protect, getProfile);

module.exports = router;