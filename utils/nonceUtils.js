const generateNonce = () => {
    return Math.random().toString(36).substring(2, 15);
};

module.exports = generateNonce;