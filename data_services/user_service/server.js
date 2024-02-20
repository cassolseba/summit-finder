/* ---------- DOTENV ---------- */
const dotenv = require("dotenv");
dotenv.config();

/* ---------- EXPRESS ---------- */
const express = require("express");
const server = express();
server.use(express.json());

/* ---------- MONGO DB ---------- */
const db = require("mongoose");
const {MONGODB_URI} = require("./config/db");
console.log(`Mongo URI is: ${MONGODB_URI}`);
db.connect(MONGODB_URI)
    .then(() => {
        console.log(`Connected to user_db`);
    })
    .catch(() => {
        console.log(`Error while connecting to user_db`);
        process.exit();
    });

/* ---------- CORS ---------- */
const cors = require("cors");

const corsOptions = {
    origin: [
        `http://localhost:${process.env.AUTHENTICATION_SERVICE_HOST_PORT}`,
        `http://user_service:${process.env.AUTHENTICATION_SERVICE_PORT}`
    ]
};
server.use(cors(corsOptions));

/* ---------- SET ROUTES ---------- */
const routes = require("./routes/user.routes.js");
server.use('/', routes);

server.get('/', (req, res) => {
    res.status(200).send("Welcome to the user data service!");
})

/* ---------- RUN SERVER ---------- */
const port = process.env.USER_SERVICE_PORT || 8080;
server.listen(port, () => {
    console.log(`SERVER IS FIRE ON PORT http://localhost:${port}`);
})