const mongoose = require("mongoose");

const FightSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    server: {
        type: String,
        default: "Server",
    },
    isFinished: {
        type: Boolean,
        default: false,
    },
    winner: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    attacks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attack'
    }],
    pokemon: {
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pokemon',
            required: true,
        },
        server: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pokemon',
            required: true,
        }
    }


});

module.exports = mongoose.model("Fight", FightSchema);