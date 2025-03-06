const express = require("express");
const {getAllPokemons,getPokemonById,startFight} = require("../controllers/pokemonController");

const router = express.Router();

router.get("/getAllPokemons", getAllPokemons);
router.get("/getPokemonById", getPokemonById);

module.exports = router;