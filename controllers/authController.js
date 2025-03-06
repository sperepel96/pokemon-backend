const User = require("../models/User");
const generateNonce = require("../utils/nonceUtils");
const { generateToken } = require("../utils/jwtUtils");
const { Web3 } = require("web3");
const { bufferToHex } =require("ethereumjs-util");
const { recoverPersonalSignature } =require("@metamask/eth-sig-util");
const {protect} = require("../middlewares/authMiddleware");
const registerOrLogin = async (req, res) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ error: "address required" });
    }
    let user = await User.findOne({ address });
    if (!user) {
        const nonce = generateNonce();
        user = new User({ address, nonce });
        await user.save();
    }
    res.json({ nonce: user.nonce });
};

const verifySignature = async (req, res) => {
    const { address, signature } = req.body;
    if (!address || !signature) {
        return res.status(400).json({ error: "address and signature required" });
    }
    const user = await User.findOne({ address });
    if (!user) {
        return res.status(404).json({ error: "user not  found" });
    }
    const message = `Sign this message to log in: ${user.nonce}`;
    const token = generateToken(address);
    const msgBufferHex = bufferToHex(Buffer.from(message, "utf8"));
    const recoveredAddress = recoverPersonalSignature({ data: msgBufferHex, signature });
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        return res.status(401).json({ error: "Invalid signature" });
    }
    user.nonce = generateNonce();
    await user.save();
    res.json({ token });
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ address: req.user.address });
        if (!user) return res.status(404).json({ error: "user not found" });

        res.json({ address: user.address });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { registerOrLogin, verifySignature,getProfile };