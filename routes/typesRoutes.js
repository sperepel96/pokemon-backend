const express = require("express");
const {getPokemonTypes} = require("../controllers/typesController");

const router = express.Router();

router.get("/getPokemonTypes", getPokemonTypes);

module.exports = router;