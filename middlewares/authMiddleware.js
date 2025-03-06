const {verifyToken} = require("../utils/jwtUtils");

const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({error: "token not provided"});
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({error: "token is not valid"});
    }
};

module.exports = protect;