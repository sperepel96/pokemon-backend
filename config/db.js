const mongoose = require("mongoose");
const Type = require("../models/Type");
const Pokemon = require("../models/Pokemon");
const fs = require("node:fs");
const data = require("../assets/pokedex.json");
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
        });
        console.log("Connected до MongoDB");
    } catch (error) {
        console.error("Error connected to DB:", error);
        process.exit(1);
    }


};
const initDB = async () => {

    const typesData = [
        {
            name: "Normal",
            effective: [],
            ineffective: ["Rock", "Steel"],
            noEffect: ["Ghost"]
        },
        {
            name: "Fighting",
            effective: ["Normal", "Ice", "Rock", "Dark", "Steel"],
            ineffective: ["Poison", "Flying", "Psychic", "Bug", "Fairy"],
            noEffect: ["Ghost"]
        },
        {
            name: "Flying",
            effective: ["Grass", "Fighting", "Bug"],
            ineffective: ["Electric", "Rock", "Steel"],
            noEffect: []
        },
        {
            name: "Poison",
            effective: ["Grass", "Fairy"],
            ineffective: ["Poison", "Ground", "Rock", "Ghost"],
            noEffect: ["Steel"]
        },
        {
            name: "Ground",
            effective: ["Fire", "Electric", "Poison", "Rock", "Steel"],
            ineffective: ["Grass", "Bug"],
            noEffect: ["Flying"]
        },
        {
            name: "Rock",
            effective: ["Fire", "Ice", "Flying", "Bug"],
            ineffective: ["Fighting", "Ground", "Steel"],
            noEffect: []
        },
        {
            name: "Bug",
            effective: ["Grass", "Psychic", "Dark"],
            ineffective: ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel", "Fairy"],
            noEffect: []
        },
        {
            name: "Ghost",
            effective: ["Psychic", "Ghost"],
            ineffective: ["Dark"],
            noEffect: ["Normal"]
        },
        {
            name: "Steel",
            effective: ["Ice", "Rock", "Fairy"],
            ineffective: ["Fire", "Water", "Electric", "Steel"],
            noEffect: []
        },
        {
            name: "Fire",
            effective: ["Grass", "Ice", "Bug", "Steel"],
            ineffective: ["Fire", "Water", "Rock", "Dragon"],
            noEffect: []
        },
        {
            name: "Water",
            effective: ["Fire", "Ground", "Rock"],
            ineffective: ["Water", "Grass", "Dragon"],
            noEffect: []
        },
        {
            name: "Grass",
            effective: ["Water", "Ground", "Rock"],
            ineffective: ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon", "Steel"],
            noEffect: []
        },
        {
            name: "Electric",
            effective: ["Water", "Flying"],
            ineffective: ["Electric", "Grass", "Dragon"],
            noEffect: ["Ground"]
        },
        {
            name: "Psychic",
            effective: ["Fighting", "Poison"],
            ineffective: ["Psychic", "Steel"],
            noEffect: ["Dark"]
        },
        {
            name: "Ice",
            effective: ["Grass", "Ground", "Flying", "Dragon"],
            ineffective: ["Fire", "Water", "Ice", "Steel"],
            noEffect: []
        },
        {
            name: "Dragon",
            effective: ["Dragon"],
            ineffective: ["Steel"],
            noEffect: ["Fairy"]
        },
        {
            name: "Dark",
            effective: ["Psychic", "Ghost"],
            ineffective: ["Fighting", "Dark", "Fairy"],
            noEffect: []
        },
        {
            name: "Fairy",
            effective: ["Fighting", "Dragon", "Dark"],
            ineffective: ["Fire", "Poison", "Steel"],
            noEffect: []
        }
    ]

    async function seedTypes() {
        try {
            await Type.insertMany(typesData);

            console.log("Add Type");
        } catch (err) {
            console.error(err);
        }
    }

    async function syncPokedexToDatabase() {
        try {

            const cleanedPokemon = data.map((pokemon) => {
                return {
                    id: pokemon.id,
                    name: pokemon.name.english,
                    species: pokemon.species,
                    type: pokemon.type,
                    level: pokemon.level || 1,
                    base: {
                        hp: pokemon.base?.HP || 50,
                        attack: pokemon.base?.Attack || 50,
                        defense: pokemon.base?.Defense || 50,
                        speed: pokemon.base?.Speed || 50,
                    },
                    profile: {
                        height: pokemon.base?.height || Math.floor(Math.random() * 10) + 1,
                        weight: pokemon.base?.weight || Math.floor(Math.random() * 10) + 1,
                        egg: pokemon.base?.egg || Math.floor(Math.random() * 10) + 1,
                        gender: pokemon.base?.gender || Math.floor(Math.random() * 10) + 1,
                    },
                    description: pokemon.description,
                    image: {
                        hires: pokemon.image?.hires || "",
                    },
                    abilities: pokemon.profile?.abilities ? pokemon.profile?.abilities : [],
                };
            });

            await Pokemon.insertMany(cleanedPokemon);
            console.log("sync success");


        } catch (error) {
            console.error("errorsync pokedox:", error.message);

        }
    }

    // syncPokedexToDatabase();
    // seedTypes();
};

module.exports = {connectDB, initDB};