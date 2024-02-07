/* ---------- DOTENV ---------- */
const dotenv = require("dotenv");
dotenv.config();

/* ---------- CORS ---------- */
const cors = require("cors");
var corsOptions = {
    origin: "http://localhost:3000"
};
server.use(cors(corsOptions));

/* ---------- EXPRESS ---------- */
const express = require("express");
const server = express();
server.use(express.json());

/* ---------- SET ROUTES ---------- */
server.get('/', (req, res) => {
    res.status(200).send("Welcome to the user data service!");
})

/* ---------- RUN SERVER ---------- */
const port = process.env.USER_SERVICE_PORT || 8080;
server.listen(port, () => {
    console.log(`SERVER IS FIRE ON PORT http://localhost:${port}`);
})