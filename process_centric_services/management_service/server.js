/* ---------- DOTENV ---------- */
const dotenv = require("dotenv");
dotenv.config();

/* ---------- EXPRESS ---------- */
const express = require("express");
const server = express();
server.use(express.json());

/* ---------- CORS ---------- */
const cors = require("cors");

const corsOptions = {
    origin: "http://localhost:3000"
};
server.use(cors(corsOptions));

/* ---------- SET ROUTES ---------- */
// const routes = require("./routes/management.routes")
// server.use('/', routes);

server.get('/', (req, res) => {
    res.status(200).send("Welcome to the management service!");
})

/* ---------- RUN SERVER ---------- */
const port = process.env.MANAGEMENT_SERVICE_PORT || 8080;
server.listen(port, () => {
    console.log(`SERVER IS FIRE ON PORT http://localhost:${port}`);
})