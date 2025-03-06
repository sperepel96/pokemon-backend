const express = require("express");
const {connectDB, initDB} = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const pokemonsRoutes = require("./routes/pokemonsRoutes");
const typesRoutes = require("./routes/typesRoutes");
const fightsRoutes = require("./routes/fightsRoutes");
require("dotenv").config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors')
const app = express();
const http = require("http");
const {configureSocket} = require("./socket/socketHandler");

app.use(cors())

app.use(express.json());

connectDB();
initDB()

app.use("/api/auth", authRoutes);
app.use("/api/pokemons", pokemonsRoutes);
app.use("/api/types", typesRoutes);
app.use("/api/fight", fightsRoutes);

// додати  апішки якщо буде час
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const server = http.createServer(app);

const io = configureSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(5001, () => {
    console.log("Socket port: 3000");
});
app.listen(PORT, () => console.log(`HTTP port ${PORT}`));

