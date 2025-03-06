const {Server} = require("socket.io");
const {verifyToken} = require("../utils/jwtUtils");
const {performAttack, startFight, getComputerEnemy, finishFight} = require("../services/fight");
const Attack = require("../models/Attack");
const Pokemon = require("../models/Pokemon");
const User = require("../models/User");

const activeFights = new Map();

const configureSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        try {
            const user = verifyToken(token);
            socket.user = user;
            next();
        } catch (err) {
            return next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("USer:", socket.id);
        socket.on("start-fight", async ({pokemonId}) => {
            const playerName = socket.user.address;
            const playerId = await User.findOne({address: playerName}).then(user => user?._id);
            try {
                const pokemon = await Pokemon.findOne({id: pokemonId});
                const enemy = await getComputerEnemy(pokemon.type);

                const fight = await startFight(playerId, pokemon._id, enemy._id);

                const state = {
                    fightId: fight._id,
                    playerHP: pokemon?.base?.hp || 100,
                    serverHP: enemy?.base?.hp || 100,
                    currentTurn: pokemon.base.speed > enemy.base.speed ? "player" : "server",
                    player: {
                        name: playerName, stats: {
                            level: Math.floor(Math.random() * 10) + 1,
                            attack: pokemon?.base?.attack,
                            defense: pokemon?.base?.defense
                        }
                    },
                    server: {
                        name: "Server", stats: {
                            level: Math.floor(Math.random() * 10) + 1,
                            attack: enemy?.base?.attack,
                            defense: enemy?.base?.defense
                        }
                    },
                };
                activeFights.set(fight._id.toString(), state);
                socket.join(fight._id.toString());
                io.to(fight._id.toString()).emit("fight-started", {
                    fightId: state.fightId,
                    playerHP: state.playerHP,
                    serverHP: state.serverHP,
                    pokemon: pokemon,
                    enemy: enemy
                });
                if (state?.currentTurn === "server") {
                    await performAttack(io, state.fightId, state, true, activeFights);
                }
            } catch (error) {
                console.error(error);
                socket.emit("error", "Error starting fight.");
            }
        });

        socket.on("player-attack", async ({fightId}) => {
            const state = activeFights.get(fightId);
            if (!state || state.currentTurn !== "player") {
                return socket.emit("error", "Hit is not available.");
            }

            try {
                await performAttack(io, fightId, state, false, activeFights);

                const updatedState = activeFights.get(fightId);
                if (updatedState?.serverHP <= 0) {
                    return;
                }
                await performAttack(io, fightId, updatedState, true, activeFights);
            } catch (error) {
                console.error("ERoor attack:", error);
                socket.emit("error", "Error attacking");

            }

        });
        socket.on("disconnect", () => {
            console.log("Disconnect:", socket.id);
        });
    });

    return io;
};

module.exports = {configureSocket};