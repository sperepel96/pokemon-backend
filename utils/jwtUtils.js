const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../config/env");

const generateToken = (address) => {
    return jwt.sign({ address }, jwtSecret, { expiresIn: jwtExpire });
};

const verifyToken = (token) => {
    return jwt.verify(token, jwtSecret);
};

module.exports = { generateToken, verifyToken };