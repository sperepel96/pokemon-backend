const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema({
    id: Number,
    name: String,
    species: String,
    type: [String],
    level: Number,
    base: {
        hp: Number,
        attack: Number,
        defense: Number,
        speed: Number,
    },
    profile: {
        height: String,
        weight: String,
        egg: [String],
        gender: String,
    },
    description: String,
    image: {
        hires: String,
    },
    abilities: [String],
});

module.exports = mongoose.model("Pokemon", pokemonSchema);

