const Type = require("../models/Type");
const getPokemonTypes = async (req, res) => {

    try {
        const types = await Type.find();

        res.status(200).json({
            data:types,
            success:true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to fetch pokemons' });
    }
}
module.exports = { getPokemonTypes };
