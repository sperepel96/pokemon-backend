const mongoose = require("mongoose");

const AttackSchema = new mongoose.Schema({
    fightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fight",
        required: true,
    },
    attacker: {
        type: String,
        required: true,
    },
    damage: {
        type: Number,
        required: true,
    },
    defenderCurrentHP: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Attack", AttackSchema);