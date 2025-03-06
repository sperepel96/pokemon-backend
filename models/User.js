const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
    },
    nonce: {
        type: String,
        required: true,
    },
    fights: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fight'
    }]
});

module.exports = mongoose.model("User", UserSchema);