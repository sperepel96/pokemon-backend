require("dotenv").config();

module.exports = {
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/metamaskAuth",
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || "2h",
};