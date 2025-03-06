const Pokemon = require("../models/Pokemon");
const Fight = require("../models/Fight");
const Attack = require("../models/Attack");
const Type = require("../models/Type");
const User = require("../models/User");

const calculateDamage = (attackerStats, defenderStats, defenderHP) => {
    const randomFactor = Math.random();
    const damage = (Math.round(((((2 * attackerStats.level) / 5 + 2) * attackerStats.attack * (attackerStats.attack / defenderStats.defense)) / (50 + 2) * randomFactor) * 10) / 10);

    return {
        damage, newHP: Math.max(0, defenderHP - damage).toFixed(1),
    };
};

const startFight = async (playerId, playerPokemonId, enemyPokemonId) => {
    const fight = await Fight.create({
        player: playerId, isFinished: false, pokemon: {
            player: playerPokemonId, server: enemyPokemonId
        }
    });
    await User.findByIdAndUpdate(playerId, {$push: {fights: fight._id}});
    return fight;
};


const finishFight = async (fightId, winnerName) => {
    const fight = await Fight.findById(fightId);
    fight.isFinished = true;
    fight.winner = winnerName;
    await fight.save();
};


const getComputerEnemy = async (selectedType) => {

    const type = await Type.findOne({name: selectedType});
    if (!type) {
        console.warn(`TYpe "${selectedType}" not found. Returning random pokemon.`);
        return await getRandomPokemon();

    }
    const effectiveTypes = type.effective;

    if (effectiveTypes.length === 0) {
        console.warn("No effective types for this type. Returning random pokemon.");
        return await getRandomPokemon();
    }
    const pokemons = await Pokemon.aggregate([{$match: {type: {$in: effectiveTypes}}}, {$sample: {size: 1}}]);
    if (pokemons.length === 0) {
        console.warn("No pokemons with effective types. Returning random pokemon.");
        return await getRandomPokemon();
    }
    return pokemons[0];

}
const getRandomPokemon = async () => {
    const randomPokemon = await Pokemon.aggregate([{$sample: {size: 1}}]);
    if (!randomPokemon || randomPokemon.length === 0) {
        throw new Error("Error getting random pokemon.");
    }
    return randomPokemon[0];
};


const performAttack = async (io, fightId, state, isServer, activeFights) => {
    const defender = isServer ? state.player : state.server;
    const ataker = isServer ? state.server : state.player;
    const hp = isServer ? state.playerHP : state.serverHP;
    try {
        const attackResult = calculateDamage(ataker.stats, defender.stats, hp);


        const attack = await Attack.create({
            fightId: fightId,
            attacker: isServer ? "Server" : "Player",
            damage: attackResult.damage,
            defenderCurrentHP: attackResult.newHP,
        });
        await Fight.findByIdAndUpdate(fightId, {$push: {attacks: attack._id}});

        if (isServer) {
            state.playerHP = attackResult.newHP;
            state.currentTurn = "player";

        } else {
            state.serverHP = attackResult.newHP;
            state.currentTurn = "server";

        }

        if (state.playerHP <= 0) {
            await finishFight(fightId, "Server");
            activeFights.delete(fightId);
            io.to(fightId).emit("fight-ended", {
                fightState: {
                    playerHP: state.playerHP,
                    serverHP: state.serverHP,
                    currentTurn: state.currentTurn,
                    damage: attackResult.damage
                }, result: {
                    winner: "server", message: "Server won!",
                }
            });
        } else if (state.serverHP <= 0) {
            await finishFight(fightId, "Player");
            activeFights.delete(fightId);
            io.to(fightId).emit("fight-ended", {
                fightState: {
                    playerHP: state.playerHP,
                    serverHP: state.serverHP,
                    currentTurn: state.currentTurn,
                    damage: attackResult.damage
                }, result: {
                    winner: "player", message: "Player won!",
                }

            });
        } else {
            io.to(fightId.toString()).emit("update-state", {
                playerHP: state.playerHP,
                serverHP: state.serverHP,
                currentTurn: state.currentTurn,
                damage: attackResult.damage
            });
        }

    } catch (error) {
        console.error(error);
        io.to(fightId).emit("error", `Error attack ${isServer ? "server" : "player"}`);
    }


};
module.exports = {
    getComputerEnemy, performAttack, startFight, finishFight
};
