const Pokemon = require("../models/Pokemon");
const {getComputerEnemy} = require('../services/fight')
const {registerOrLogin} = require("./authController");

const getAllPokemons = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const {type, sortBy, order, search} = req.query;

    try {
        const skip = (page - 1) * limit;
        const sortingField = sortBy || 'id';
        const sortingOrder = order || "desc";

        const filter = {};
        if (type) {
            filter.type = {$in: type};
        }
        if (search) {
            filter.name = {
                $regex: search, $options: 'i'
            };
        }
        const totalPokemons = await Pokemon.countDocuments(filter);
        const totalPages = Math.ceil(totalPokemons / limit);
        const pokemons = await Pokemon.find(filter)
            .sort({[sortingField]: sortingOrder})
            .skip(skip)
            .limit(limit).exec();

        res.status(200).json({
            pokemons,
            currentPage: page,
            totalPages,
            totalPokemons,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Unable to fetch pokemons'});
    }
}
const getPokemonById = async (req, res) => {
    try {
        console.log(req.query.id)
        const pokemon = await Pokemon.findById(req.query.id);
        res.status(200).json({
            pokemon,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Unable to fetch pokemon'});
    }
}

const startFight = async (req, res) => {
    try {

        const pokemon = await Pokemon.findOne({id: req.query.id});
        const enemy = await getComputerEnemy(pokemon.type);
        res.status(200).json({
            pokemon, enemy
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Unable to fetch pokemon'});
    }
}

module.exports = {getAllPokemons, getPokemonById, startFight};